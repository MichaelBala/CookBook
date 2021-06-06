//@@viewOn:imports
import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import {createVisualComponent, useDataList, useState} from "uu5g04-hooks";
import Calls from "calls";
//@@viewOff:imports

const STATICS = {
    //@@viewOn:statics
    displayName: "RecipeUpdateForm",
    //@@viewOff:statics
};

const CLASS_NAMES = {
    welcomeRow: () => Config.Css.css``,
};

export const RecipeUpdateForm = createVisualComponent({
    ...STATICS,

    //@@viewOn:propTypes
    propTypes: {
        createItem: UU5.PropTypes.func,
        setSelectedRecipeData: UU5.PropTypes.func,
        selectedRecipeData: UU5.PropTypes.object
    },
    //@@viewOff:propTypes

    //@@viewOn:defaultProps
    //@@viewOff:defaultProps
    
    render(props) {
        //@@viewOn:hooks

        const [newComponents, setnewComponents] = useState(0);

        //@@viewOff:hooks


        //@@viewOn:private

        

        function getIngredientListSelect (ingredientID) {


            return (
                    <UU5.Bricks.Div>
                        <UU5.Forms.Select
                            name={"ingredient" + ingredientID}
                            label={<UU5.Bricks.Lsi lsi={{en: "Ingredients", cs: "Ingredience"}}/>}
                            multiple={false}
                            value={ingredientID}
                            readOnly={true}
                            >
                            {ingredientList}
                    </UU5.Forms.Select>
                    <UU5.Forms.Number
                        name={"ingredientAmount" + ingredientID}
                        label={<UU5.Bricks.Lsi lsi={{en: "Amount", cs: "Množství"}}/>}
                        value={props.selectedRecipeData.data.ingredientList[ingredientID]}
                        valueType={"number"}
                    >
                    </UU5.Forms.Number>
                </UU5.Bricks.Div>
            )
        }

        function getIngredientComponents() {
            let ingredientComponentList = []
            if(props.selectedRecipeData && props.selectedRecipeData.data.ingredientList) {

                Object.keys(props.selectedRecipeData.data.ingredientList).forEach((ingredientID) => {
                    ingredientComponentList.push(
                        getIngredientListSelect(ingredientID)
                    )
                })
                
            } 
            for(var i = 0;i<newComponents; i++){
                ingredientComponentList.push(
                    getNewIngredientListSelect(i)
                )
            }
            return ingredientComponentList
            
        }

        function getNewIngredientListSelect (ingredientID) {
            return (
                    <UU5.Bricks.Div>
                        <UU5.Forms.Select
                            name={"ingredientNew"+ ingredientID}
                            label={<UU5.Bricks.Lsi lsi={{en: "Ingredients", cs: "Ingredience"}}/>}
                            multiple={false}
                            >
                            {ingredientList}
                    </UU5.Forms.Select>
                    <UU5.Forms.Number
                        name={"ingredientNewAmount" + ingredientID}
                        label={<UU5.Bricks.Lsi lsi={{en: "Amount", cs: "Množství"}}/>}
                        valueType={"number"}
                    >
                    </UU5.Forms.Number>
                </UU5.Bricks.Div>
            )
        }
        const dataListResult = useDataList({
            handlerMap: {
                load: Calls.listIngredients,
            },
            initialDtoIn: {data: {}}
        });

        let ingredientList = [];
        dataListResult.data && dataListResult.data.forEach(ingredient => {
            if (ingredient.data.approved) {
                ingredientList.push(
                    <UU5.Forms.Select.Option
                        key={ingredient.data.id}
                        value={ingredient.data.id}
                        content={ingredient.data.name + " (" + ingredient.data.measure + ")"} 
                    />
                )
            }
        })

        


        function onSave(opt) {
            let newIngredientList = {}

            setnewComponents(0)
    
            for (const [key, value] of Object.entries(opt.values)){
                if (key.startsWith("ingredientAmount") && value > 0) {
                    newIngredientList[key.replace("ingredientAmount","")] = value
                }
                if (key.startsWith("ingredientNewAmount") && value > 0){
                    let using_key = key.replace("Amount","") 
                    newIngredientList[opt.values[using_key]] = value
                } 
            }
            opt.values["ingredientList"] = newIngredientList


            if (props.selectedRecipeData && props.selectedRecipeData.data && props.selectedRecipeData.data.id) {
                props.selectedRecipeData.handlerMap.update({data: opt.values})
            } else {
                props.createItem({data: opt.values})


            }
            props.setSelectedRecipeData(null)
        }

        //@@viewOff:private

        //@@viewOn:interface
        //@@viewOff:interface

        //@@viewOn:render
        const attrs = UU5.Common.VisualComponent.getAttrs(props);
        let selectedRecipeData = props.selectedRecipeData && props.selectedRecipeData.data || {}
        
        return (
            <div {...attrs} className={"uu5-common-padding-s"}>
                <UU5.Forms.Form
                    onSave={onSave}
                    onCancel={() => {props.setSelectedRecipeData(null); setnewComponents(0)}}
                    header={selectedRecipeData && selectedRecipeData.id
                        ? <UU5.Bricks.Lsi lsi={{en: "Update Recipe", cs: "Upravit knihu"}}/>
                        : <UU5.Bricks.Lsi lsi={{en: "Create Recipe", cs: "Vytvořit knihu"}}/>
                    }
                    spacing={4}
                    level={5}
                    labelColWidth={"xs-12 s-12 m4 l4 xl4"}
                    inputColWidth={"xs-12 s-12 m6 l6 xl6"}
                >
                    <UU5.Forms.Text
                        name="id"
                        label="id"
                        placeholder="id"
                        reguired
                        value={selectedRecipeData && selectedRecipeData.id}
                        readOnly={selectedRecipeData && selectedRecipeData.id}
                    />
                    <UU5.Forms.Text
                        name="name"
                        label={<UU5.Bricks.Lsi lsi={{en: "Name", cs: "Název"}}/>}
                        placeholder="Some text..."
                        reguired
                        value={selectedRecipeData && selectedRecipeData.name}
                    />
                    <UU5.Forms.Text
                        name="author"
                        label={<UU5.Bricks.Lsi lsi={{en: "Author", cs: "Autor"}}/>}
                        placeholder="Some text..."
                        required
                        value={selectedRecipeData && selectedRecipeData.author}
                    />
                     <UU5.Forms.Text
                        name="difficulty"
                        label={<UU5.Bricks.Lsi lsi={{en: "Difficulty", cs: "Náročnost"}}/>}
                        placeholder="Some text..."
                        required
                        value={selectedRecipeData && selectedRecipeData.difficulty}
                    />
                    <UU5.Forms.Number
                        name="preparationTime"
                        label={<UU5.Bricks.Lsi lsi={{en: "Preparation time", cs: "Čas na přípravu"}}/>}
                        placeholder="Some text..."
                        required
                        value={selectedRecipeData && selectedRecipeData.preparationTime}
                    />
                    <UU5.Forms.TextArea
                        name="instructions"
                        label={<UU5.Bricks.Lsi lsi={{en: "Instructions", cs: "Instrukce"}}/>}
                        placeholder="Some text..."
                        required
                        value={selectedRecipeData && selectedRecipeData.instructions}
                    />
                    {getIngredientComponents()}

                   <UU5.Bricks.Button 
                        size="s" 
                        colorSchema="info"
                        onClick = {() => setnewComponents(currentValue => currentValue + 1)}
                    >
                        Add ingredients
                    </UU5.Bricks.Button> 
                    <UU5.Bricks.Line size={"s"}/>
                    <UU5.Forms.Controls/>
                </UU5.Forms.Form>
            </div>
            
        );
        
        //@@viewOff:render
    },
});

export default RecipeUpdateForm;
