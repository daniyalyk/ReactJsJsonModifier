import React, {useEffect, useState} from "react";
import TreeView from '@material-ui/lab/TreeView';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {TreeItem} from "@material-ui/lab";
type child=Array<{ id: string, name: string, children:child}>|any
interface ApiData {
    id: string,
    name: string,
    children: child
};
const useStyles = makeStyles({
    root: {
        height: 110,
        margin: 0,
        flexGrow: 1,
        maxWidth: 400,
    },
});
export const ApiDataShow = () => {

    const [fetched_data, setfetched_data] = useState([] as any);
    const alldata:ApiData[]=[] as any;
    const [data, setData] = useState([] as any);
    const [loading, setloading]= useState(true);

    useEffect(()=> {
        fetch('http://34.122.134.206:8080/api/viewall')
            .then(response => response.json())
            .then(json => setfetched_data(json))
            .catch(err=>console.log(err))
    }, []);
    useEffect(()=>{
        LoadApiData();
    },[fetched_data]);

    const Destructdata = (data_:any) => {
        const recursionFunc=(data_:any,key:string,id:number,treeNodeData:ApiData):any=>{
            if(!Array.isArray(data_) || key==="frameDBUrl"){
                treeNodeData.id=`${key}-${id}`;
                treeNodeData.name=key+" : " +data_;
                treeNodeData.children=[];
                return treeNodeData;
            }
            data_.map((childItem:any)=>{
                Object.keys(childItem).map((childKey:string,childId:number)=>{
                    treeNodeData.id=`${key}-${id}`;
                    treeNodeData.name=key+" : ...";
                    treeNodeData.children=treeNodeData.children?[...treeNodeData.children,recursionFunc(childItem[childKey],                       childKey,childId,{} as any)]:[recursionFunc(childItem[childKey],childKey,childId,{} as any)];
                });
            });
            return treeNodeData;
        };
        data_.map((item:any,index:number)=>{
            const tempData:any=[];
            Object.keys(item).map((key:string,id:number)=>{
                const treeNodeData:ApiData={} as any;
                tempData.push(recursionFunc(item[key],key,id,treeNodeData));
            });
            alldata.push({id:`Data-${index}`,name:`Data-${index}`,children:tempData})
        });
    };
    const RenderTree = (nodes: any) => {
        return (
            Array.isArray(nodes)?
            nodes.map((item:ApiData)=>
            <TreeItem key={item.id} nodeId={item.id} label={item.name}>
                {Array.isArray(item.children) ? RenderTree(item.children) : null}
            </TreeItem>):<TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}/>
            );
    };
    const LoadApiData = () => {
        console.log(fetched_data);
        setloading(false);
        Destructdata(fetched_data);
        setData(alldata);

    };
    const classes = useStyles();
    return (
        <div>
            {loading ? <h1>Api Data is Loading</h1> :
            <TreeView
                className={classes.root}
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpanded={['root']}
                defaultExpandIcon={<ChevronRightIcon/>}>
                {RenderTree(data)}
            </TreeView>}
        </div>
    )
};