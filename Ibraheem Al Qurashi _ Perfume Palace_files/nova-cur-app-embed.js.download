function loadScript(src, defer, done) {
  var js = document.createElement('script');
  js.src = src;
  js.defer = defer;
  js.onload = function(){done();};
  js.onerror = function(){
    done(new Error('Failed to load script ' + src));
  };
  document.head.appendChild(js);
}

loadScript("https://cdn.shopify.com/s/files/1/0449/2568/1820/t/4/assets/booster_currency.js?v=1624978055", true, function(){});