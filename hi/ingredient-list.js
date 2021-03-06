//@@viewOn:imports
import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import {createVisualComponent, useDataList, useState} from "uu5g04-hooks";
import Uu5Tiles from "uu5tilesg02";
import IngredientUpdateForm from "ingredientUpdateForm";
import Calls from "calls";
//@@viewOff:imports

const STATICS = {
    //@@viewOn:statics
    displayName: "IngredientList",
    //@@viewOff:statics
};

const CLASS_NAMES = {
    welcomeRow: () => Config.Css.css``,
};

export const IngredientList = createVisualComponent({
    ...STATICS,

    //@@viewOn:propTypes
    //@@viewOff:propTypes

    //@@viewOn:defaultProps
    //@@viewOff:defaultProps


    render(props) {
        //@@viewOn:private
        function onDelete(data) {
            
            //z get a set of exsiting ingredients from recipes 
            let usedIngredients = new Set;
            RecipeListResult.data.forEach(getID);
            
            function getID(item) {
                usedIngredients.add(item.data);
            }  

           
            // if ingredients are in the set dont delete, otherwise delete
            if (usedIngredients.has(data.data.id)){
                //toDo: make alert nicer (uu component?)
                setShowAlert(1);
                //alert("The ingredient was not deleted! It exists in some recipe.");
            }else{
                data.handlerMap.delete({data: {id: data.data.id}})
            }
            
            
        }


        const dataListResult = useDataList({
            handlerMap: {
                load: Calls.listIngredients,
                createItem: Calls.createIngredient
            },
            itemHandlerMap: {
                update: Calls.updateIngredient,
                approve: Calls.approveIngredient,
                delete: Calls.deleteIngredient
            },
            initialDtoIn: {data: {}}
        });
        
        const RecipeListResult = useDataList({
            handlerMap: {
                load: Calls.listUsedIngredients,
            },
            itemHandlerMap: {       
            },
            initialDtoIn: {data: {}}
        });


        const [selectedIngredientData, setSelectedIngredientData] = useState(null)
        const [showAcceptedOnly, setShowAcceptedOnly] = useState(true)
        const [showAlert, setShowAlert] = useState(0)

        const columns = [
            /* id neni treba ukazovat, ale necham zakoment kdyby prece
            {
                cell: cellProps => {
                    return cellProps.data.data.id
                },
                header: "ID",
                width: "200px"
            },
            */
            {
                cell: cellProps => cellProps.data.data.name,
                header: <UU5.Bricks.Lsi lsi={{en: "Name", cs: "Jm??no"}}/>
            },
            {
                cell: cellProps => cellProps.data.data.measure,
                header: <UU5.Bricks.Lsi lsi={{en: "Unit", cs: "Jednotka"}}/>
            },
            {
                cell: cellProps => {
                    if (cellProps.data.data.approved) {
                        return (
                            <div className={"right"}>
                                                               
                                <UU5.Bricks.Button
                                    content={<UU5.Bricks.Icon icon={"mdi-pencil"}/>}
                                    colorSchema={"blue"}
                                    bgStyle={"transparent"}
                                    onClick={() => setSelectedIngredientData(cellProps.data)}
                                />
                                <UU5.Bricks.Button
                                    content={<UU5.Bricks.Icon icon={"mdi-delete"}/>}
                                    colorSchema={"red"}
                                    bgStyle={"transparent"}
                                    onClick={() => onDelete(cellProps.data)}
                                />
                            </div>
                        )
                    } else {
                        return (
                            <div className={"center"}>
                                <UU5.Bricks.Button
                                    content={<UU5.Bricks.Icon icon={"mdi-check"}/>}
                                    colorSchema={"green"}
                                    bgStyle={"transparent"}
                                    onClick={() => cellProps.data.handlerMap.approve({data: {id: cellProps.data.data.id}})}
                                />
                                <UU5.Bricks.Button
                                    content={<UU5.Bricks.Icon icon={"mdi-delete"}/>}
                                    colorSchema={"red"}
                                    bgStyle={"transparent"}
                                    onClick={() => onDelete(cellProps.data)}
                                />
                            </div>
                        )
                    }
                }
    ,
    width: 110
    },
    ];

    function getChild()
        {
            let child;
            let dataList;
            switch (dataListResult.state) {
                case "pendingNoData":
                case "pending":
                    child = <UU5.Bricks.Loading/>
                    break;
                case "readyNoData":
                case "ready":
                    if (showAcceptedOnly) {
                        dataList = dataListResult.data.filter(item => {
                            return item.data.approved
                        })
                    } else {
                        dataList = dataListResult.data
                    }
                    child = (
                        <Uu5Tiles.List
                            height="auto"
                            data={dataList}
                            columns={columns}
                            rowAlignment={"center"}
                        />
                    );
                    break;
                case "errorNoData":
                case "error":
                    child = "error";
                    break;
            }
            return child;
        }

    function showIngredient(id)
        {
            UU5.Environment.getRouter().setRoute("ingredient", {id: id})
        }

    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const attrs = UU5.Common.VisualComponent.getAttrs(props);
    return (
        <div {...attrs} className={"uu5-common-padding-s"}>
            <UU5.Bricks.Modal offsetTop={100} shown={selectedIngredientData}>
                <IngredientUpdateForm
                    createItem={dataListResult.handlerMap.createItem}
                    setSelectedIngredientData={setSelectedIngredientData}
                    selectedIngredientData={selectedIngredientData}
                />
            </UU5.Bricks.Modal>
            <UU5.Bricks.Header content={<UU5.Bricks.Lsi lsi={{en: "Ingredient List", cs: "Seznam ingredienc??"}}/>}
                               level={3}/>
            <div className={"right"}>
                <UU5.Bricks.Button
                    content={<UU5.Bricks.Lsi lsi={{en: "Create Ingredient", cs: "Vytvo??it ingredienci"}}/>}
                    colorSchema={"green"}
                    onClick={() => setSelectedIngredientData({data: {}})}
                />
                <UU5.Bricks.Button
                    content={showAcceptedOnly
                        ? <UU5.Bricks.Lsi lsi={{en: "Show All", cs: "Zobrazit v??echny"}}/>
                        : <UU5.Bricks.Lsi lsi={{en: "Show Accepted Only", cs: "Zobrazit pouze akceptovan??"}}/>
                    }
                    colorSchema={showAcceptedOnly ? "blue" : "pink"}
                    onClick={() => setShowAcceptedOnly(currentState => !currentState)}
                />
            </div>
            {getChild()}
            <UU5.Bricks.Alert
                style={{opacity: showAlert}}
                content="The ingredient was not deleted! It exists in some recipe."
                header="Alert!" colorSchema="red" block
                onClose={() => setShowAlert(0)}/>

        </div>
    );
    //@@viewOff:render
    },
    });

    export default IngredientList;
