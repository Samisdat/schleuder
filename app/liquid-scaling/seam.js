var Seam = function(startCol, startHeat) {

    this.members = [startCol];
    this.value = startHeat;

};

Seam.prototype.getValue = function(){

    return this.value;

};

Seam.prototype.getLast = function(){

    return this.members[ (this.members.length - 1) ];

};

Seam.prototype.addRow = function(col, heat){

    this.members.push(col);
    this.value += heat;

};

Seam.prototype.getRow = function(row){

    return this.members[row];

};

module.exports = Seam;
