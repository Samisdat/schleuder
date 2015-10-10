var seam = function(startCol, startHeat){

    var members = [startCol];
    var value = startHeat;  
    
    var getValue = function(){
        return value;  
    };

    var setValue = function(_value){
        value = _value;
    };

    var getMembers = function(){
        return members;  
    };

    var setMembers = function(_members){
        members = _members;
    };
    
    var getLast = function(){
        return members[ (members.length - 1) ];
    };


    var addRow = function(col, heat){
        members.push(col);
        value += heat;
    };
    var getRow = function(row){
        return members[row];
    };
        
    return{
        getValue: getValue,
        getRow: getRow,
        addRow: addRow,
        getLast:getLast
    };
};

module.exports = seam;