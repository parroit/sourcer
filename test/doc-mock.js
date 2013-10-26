
function DocMock(value){
    this.value = value;
}
DocMock.prototype.on = function(){

};
DocMock.prototype.off = function(){

};
DocMock.prototype.setValue = function(value){
    this.value = value;
};
DocMock.prototype.getValue = function(value){
    return this.value;
};


module.exports = DocMock;

