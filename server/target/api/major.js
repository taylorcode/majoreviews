(function() {
  module.exports = function(container) {
    return container.resolve(function(_, RSVP, School, Major, Review, handler) {
      return {
        create: function(req, res, next) {
          var associateMajorWithSchool, major, partialAssociateMajorWithSchool, partialSendResp, sendResp;
          major = req.body;
          partialSendResp = null;
          partialAssociateMajorWithSchool = null;
          sendResp = function(major) {
            return res.send(major);
          };
          associateMajorWithSchool = function(schoolId, majorId) {
            return School.updatePromise({
              _id: schoolId
            }, {
              $addToSet: {
                majors: majorId
              }
            });
          };
          return School.findById(major.school).exec(handler(next).noDocError).then(function() {
            return Major.create(major).then(null, handler(next).error);
          }).then(function(major) {
            partialSendResp = sendResp.curry(major);
            return associateMajorWithSchool(major.school, major._id);
          }).then(function() {
            return partialSendResp();
          });
        },
        query: function(req, res, next) {
          var avgOveralls, getMajorsLean, matchAvgsToMajors;
          getMajorsLean = function() {
            return Major.find({}).sort('title').lean().exec(handler(next).error);
          };
          avgOveralls = function() {
            var group;
            group = Review.aggregate().group({
              _id: '$major',
              overall: {
                $avg: '$overall'
              }
            });
            return group.exec(handler(next).error);
          };
          matchAvgsToMajors = function(majors, avgs) {
            _.each(majors, function(major) {
              return _.each(avgs, function(avg) {
                if (major._id.toString() === avg._id.toString()) {
                  return major.rating = {
                    overall: avg.overall
                  };
                }
              });
            });
            return majors;
          };
          return RSVP.all([getMajorsLean(), avgOveralls()]).then(function(results) {
            return matchAvgsToMajors(results[0], results[1]);
          }).then(function(majors) {
            return res.send(majors);
          });
        },
        get: function(req, res, next) {
          var averageScores, getMajorLean, groupByQuery, majorId, matchAvgsToMajor, partialMatchAvgsToMajor;
          majorId = req.params.id;
          partialMatchAvgsToMajor = null;
          groupByQuery = {
            _id: '$major',
            overall: {
              $avg: '$overall'
            }
          };
          _.each(Review.schema.paths, function(type, path) {
            var metric;
            metric = path.split('metrics.')[1];
            if (!metric) {
              return;
            }
            return groupByQuery[metric] = {
              $avg: '$' + path
            };
          });
          averageScores = function(majorId) {
            return Review.aggregate().match({
              major: majorId
            }).group(groupByQuery).exec(handler(next).noDocError);
          };
          getMajorLean = function(majorId) {
            return Major.findByIdOrName(majorId).populate('school').populate({
              path: 'reviews',
              options: {
                sort: '-time'
              }
            }).lean().exec(handler(next).noDocError);
          };
          matchAvgsToMajor = function(major, avgs) {
            if (!avgs.length) {
              return major;
            }
            avgs = avgs[0];
            delete avgs._id;
            major.rating = {
              overall: avgs.overall,
              metrics: {}
            };
            delete avgs.overall;
            _.each(avgs, function(avg, key) {
              return major.rating.metrics[key] = avg;
            });
            return major;
          };
          return getMajorLean(majorId).then(function(major) {
            partialMatchAvgsToMajor = matchAvgsToMajor.curry(major);
            return major._id;
          }).then(averageScores).then(function(avgs) {
            return res.send(partialMatchAvgsToMajor(avgs));
          });
        }
      };
    });
  };

}).call(this);
