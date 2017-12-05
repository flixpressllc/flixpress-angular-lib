export function remove(item: any, array: any[]) {
  var index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
}

export function removeAtIndex(index: number, array: any[]) {
  if (index > -1) {
    array.splice(index, 1);
  }
}

export function add(item: any, array: any[]) {
  array.push(item);
}

export function clear(array: any[]) {
  array.splice(0, array.length);
}

export function insertAfter(index: number, item: any, array: any[]) {
  if ((index > -1) && (index < array.length))
  {
    array.splice(index, 0, item);
  }
}

export function insertBefore(index: number, item: any, array: any[]) {
  if ((index >= 1) && (index < array.length)) {
    array.splice(index-1, 0, item);
  }
}

export function anyOfFirstIsInSecond(firstArray: any[], secondArray: any[]) {
  for (var i = 0; i < firstArray.length; i++){
    if (secondArray.indexOf(firstArray[i]) > -1) {
      return true;
    }
  }

  return false;
}

export function allOfFirstIsInSecond(firstArray: any[], secondArray: any[]) {
  for (var i = 0; i < firstArray.length; i++) {
    if (secondArray.indexOf(firstArray[i]) == -1) {
      return false;
    }
  }

  return true;
}

export function canMoveUp(item: any, array: any[]): boolean{
  return (array.indexOf(item) > 0);
}

export function canMoveDown(item: any, array: any[]): boolean{
  return (array.indexOf(item) < array.length - 1);
}

export function moveUp(item: any, array: any[]){
  if(this.canMoveUp(item, array)){
    var index = array.indexOf(item);
    this.delete(item, array);
    this.insertAfter(index - 1, item, array);
  }
}

export function moveDown(item: any, array: any[]){
  if(this.canMoveDown(item, array)){
    var index = array.indexOf(item);
    this.delete(item, array);
    if (index == array.length - 1)
    array.push(item);
    else
    this.insertAfter(index + 1, item, array);
  }
}
