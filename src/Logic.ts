import { Construct, ConstructResult, Member } from "./State"

// 組み合わせ関数
const combination = (array:Member[],n:number):Array<Member[]> =>{
    return n===1 ? 
        array.map(x=>[x])
    :   array.flatMap((x,i)=> {
        return combination(array.slice(i+1),n-1).map(y=>[x].concat(y))
    })
}

const searchPairPattern = (targetPair:Construct,member_cnt:number):ConstructResult =>{
    const select_func = (a:number,b:number):boolean => {return  a > b}
    const default_value = select_func(2,1) ? -1:member_cnt*2
    let dp = Array<number>(member_cnt*2)
    let dp_w = Array<string>(member_cnt*2)
    dp.fill(default_value)
    dp_w.fill('')
    dp[0] = 0
    for (let i = 0; i < member_cnt; i++) {
        let next_i = dp[i]+1
        targetPair.pairs.forEach((pair)=>{
            if (select_func(next_i,dp[i+pair])===true) {
                dp[i+pair] = next_i
                dp_w[i+pair] = dp_w[i]+String(pair)
            }
        })
    }
    const pair_total = dp_w[member_cnt].split('')
    let count = pair_total.reduce((prev:ConstructResult,current:string)=>{
        prev[current] = (prev[current] || 0)+1;
        return prev
    },{})
    return count
}

export {combination,searchPairPattern}