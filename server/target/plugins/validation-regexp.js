(function() {
  exports.regexp = {
    url: [/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, 'Invalid URL.'],
    email: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/, 'Invalid email address.'],
    number: [/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/, 'Not a number.']
  };

}).call(this);
