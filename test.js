const allParams = ['string', 'sku', 'date1', 'date2', 'status'];
var paramList =   {'string':'test', 'sku':'8772181', 'status':'active'};

isPresent = allParams.filter(param => {
  return param in paramList;
});

console.log(isPresent);