import { number } from "yargs"
import { Construct, ConstructResult, DayPairs, Member,WorkPairs,Pair, } from "./State"

// 組み合わせ関数
const combination = (array:Member[],n:number):Array<Member[]> =>{
    return n===1 ? 
        array.map(x=>[x])
    :   array.flatMap((x,i)=> {
        return combination(array.slice(i+1),n-1).map(y=>[x].concat(y))
    })
}

const searchPairPattern = (targetPair:Construct,member_cnt:number,direction:boolean):ConstructResult =>{
    const select_func = (a:number,b:number):boolean => {return  direction ? a > b:a < b}
    const default_value = select_func(2,1) ? -1:member_cnt*2
    let dp = Array<number>(member_cnt*2)
    let dp_w = Array<string>(member_cnt*2)
    dp.fill(default_value)
    dp_w.fill('')
    dp[0] = 0
    for (let i = 0; i < member_cnt; i++) {
        let next_i = dp[i]+1
        targetPair.pairs.forEach((pair)=>{
            if (select_func(next_i,dp[i+pair.pair_cnt])===true) {
                dp[i+pair.pair_cnt] = next_i
                dp_w[i+pair.pair_cnt] = dp_w[i]+String(pair.pair_cnt)
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

function padPair(pair: Pair, padding: number): Pair {
    const paddedPair = { ...pair };
    paddedPair.pair = [...pair.pair, ...Array(padding-pair.pair.length).fill({ idx: -1, name: '', level: -1 })];
    return paddedPair;
}

function _createWorkPairsTrial(construct:Construct,members:Member[]): [WorkPairs,number,number,number,number]{
    const ret:WorkPairs = {WorkPairs:[]}
    const pairs:ConstructResult = members.length > 0 ? searchPairPattern(construct,members.length,construct.pairs[0].pair_cnt < construct.pairs[1].pair_cnt):{}
    let tidx = 0
    const allpairs:Pair[][] = construct.pairs.map(pair => combination(members,pair.pair_cnt).map(pair =>{tidx+=1;return {idx:tidx,pair:pair}}))
    let yesterday:DayPairs = {pairs:[]}
    let beforeyesterday:DayPairs = {pairs:[]}
    let beforeday:DayPairs[] = [{pairs:[]}]
    let pair_idx = 0
    for(let i = 0;i<construct.work_day;i++)
    {
        const Day:DayPairs = {pairs:[]}
        construct.pairs.forEach(pair_construct => {
            const targetPairs = allpairs[pair_construct.idx]
            if(pairs[pair_construct.pair_cnt] > 0){
                for(let j = 0;j<pairs[pair_construct.pair_cnt];j++)
                {
                    const random_idx = Math.floor(Math.random()*targetPairs.length)
                    let target_pair = targetPairs[random_idx]
                    let duplicated_pair = Day.pairs.some(pair =>
                        pair.pair.some(member => target_pair.pair.some(tmember => tmember.idx===member.idx))
                    ) || beforeday.map(yesterday => yesterday.pairs.some(pair => pair.idx === target_pair.idx)).some(value=>value)
                    let idx = random_idx;
                    let day_member = Day.pairs.reduce((total:number,pair:Pair,idx,array)=>{return total+pair.pair.length},0)
                    if (day_member+pair_construct.pair_cnt >= members.length)
                    {
                        while(duplicated_pair)
                        {
                            idx =  Math.floor(Math.random()*targetPairs.length);
                            target_pair = targetPairs[idx]
                            
                            duplicated_pair = Day.pairs.some(pair =>
                                pair.pair.some(member => target_pair.pair.some(tmember => tmember.idx===member.idx))
                            )
                        }
                    }else{
                        while(duplicated_pair)
                        {
                            idx =  Math.floor(Math.random()*targetPairs.length);
                            target_pair = targetPairs[idx]
                            
                            duplicated_pair = Day.pairs.some(pair =>
                                pair.pair.some(member => target_pair.pair.some(tmember => tmember.idx===member.idx))
                            ) || beforeday.map(yesterday => yesterday.pairs.some(pair => pair.idx === target_pair.idx)).some(value=>value)
                        }
                    }
                    Day.pairs.push(target_pair)
                    pair_idx += 1
                }
            }
        })
        ret.WorkPairs.push(Day)
        yesterday = JSON.parse(JSON.stringify(Day))
        beforeday.push(yesterday)
        beforeday = beforeday.slice(Math.max(-Math.floor(members.length/2.0),-5))
    }
    const pair_idx_list = ret.WorkPairs.reduce((prev:number[],dayPairs) => {
        dayPairs.pairs.map(pair => pair.idx).forEach(pair_idx => prev.push(pair_idx))
        return prev
    },[])
    const pair_count = pair_idx_list.reduce(function(prev: Map<number,number>, current) {
        prev.set(current,(prev.get(current) || 0)+1);
        return prev;
      }, new Map<number,number>())
    const duplicat_pair_count = Array.from(pair_count.values()).reduce((prev,current)=> prev+(current>1 ? 1:0),0)
    const used_pair_count = pair_count.size
    const max_pair_count = Array.from(pair_count.values()).reduce((prev,current) => current>prev ? current:prev,0)
    const required_pair_count = ret.WorkPairs.reduce((prev,current)=>current.pairs.length+prev,0)
    return [ret,duplicat_pair_count,used_pair_count,required_pair_count,max_pair_count]
}

async function createWorkPairs(construct:Construct,members:Member[]){
    function eval_func(duplicat_pair_count:number,used_pair_count:number,required_pair_count:number,max_pair_count:number)
    {
        const use_rate = used_pair_count/required_pair_count
        const dup_rate = duplicat_pair_count/required_pair_count
        return use_rate-dup_rate-max_pair_count*0.1
    }
    let best_ret:WorkPairs = {WorkPairs:[]}
    let best_pair = [0,0,0]
    let best_score = -1.0
    let trials = construct.n_trials
    for (let index = 0; index < trials; index++) {
        const [ret,duplicat_pair_count,used_pair_count,required_pair_count,max_pair_count] = _createWorkPairsTrial(construct,members)
        const score = eval_func(duplicat_pair_count,used_pair_count,required_pair_count,max_pair_count)
        if(score > best_score)
        {
            best_ret=JSON.parse(JSON.stringify(ret))
            best_score = score
            best_pair = [duplicat_pair_count,used_pair_count,required_pair_count,max_pair_count]
        }
    }
    console.log(best_score,best_pair)
    return best_ret
}

export {combination,searchPairPattern,createWorkPairs,padPair}