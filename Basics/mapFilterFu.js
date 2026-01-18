const input=[1,2,3,4,5]

function transform(i){
    return i*2;
}
// Map-----------------------
// Solution 1
const newArray=[];
for(let i=0;i<input.length;i++){
    newArray.push(input[i]*3)
}

console.log(newArray);


// Solutions 2
// const output=input.map(transform)
// instead of writing the function in another line u can just do like this 
const arr=[1,2,3,4,5,6,7,8,9,10]
// const output=arr.map((i)=>{
//     return i*4;
// });
// console.log(output);


// Filter function 
// const ans=arr.filter((n)=>{
//     return n%2==0;
// })

// console.log(ans);


//2
const out=arr.filter((e)=>{
    if(e%2==0) return true;
    else return false;
});

console.log(out);

