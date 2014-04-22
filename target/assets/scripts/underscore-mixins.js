(function() {
  _.mixin({
    strip: function(obj, props) {
      _.each(props, function(prop) {
        return delete obj[prop];
      });
      return obj;
    }
  });

}).call(this);
