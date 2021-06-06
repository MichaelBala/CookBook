//@@viewOn:imports

import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import {createVisualComponent, useDataObject, useState} from "uu5g04-hooks";
//import RecipeUpdateForm from "recipeUpdateForm";
import Calls from "calls";
//@@viewOff:imports

const STATICS = {
    //@@viewOn:statics
    displayName: "Recipe",
    //@@viewOff:statics
};

const CLASS_NAMES = {
    welcomeRow: () => Config.Css.css`
    padding: 56px 0 20px;
    max-width: 624px;
    margin: 0 auto;
    text-align: center;

    ${UU5.Utils.ScreenSize.getMinMediaQueries("s", `text-align: left;`)}

    .uu5-bricks-header {
      margin-top: 8px;
    }

    .plus4u5-bricks-user-photo {
      margin: 0 auto;
    }
  `,
};

export const Recipe = createVisualComponent({
    ...STATICS,

    //@@viewOn:propTypes
    //@@viewOff:propTypes

    //@@viewOn:defaultProps
    //@@viewOff:defaultProps

    render(props) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        //@@viewOn:private
        let recipeDataObject = useDataObject({
            handlerMap: {
                load: Calls.getRecipe
            },
            initialDtoIn: {
                data: {
                    id: urlParams.get("id")
                }
            }
        })
        
        

        const [newList, setNewList] = useState(recipeDataObject.data);

        function recipeRecalculation(opt){
            opt.component.onChangeDefault(opt, () => {

                        let value = opt.value;
                        let newIngredientList = JSON.parse(JSON.stringify(recipeDataObject.data));
                        Object.keys(recipeDataObject.data.ingredientList).forEach(function(index){
                            newIngredientList.ingredientList[index] *= value;
                        });

                    setNewList(newIngredientList)
                
                })
        };
        function tableRecipe(){
            return(
                <UU5.Bricks.Div>
                    <UU5.Forms.Text
                        name="name"
                        label={<UU5.Bricks.Lsi lsi={{en: "Name", cs: "Název"}}/>}
                        readOnly
                        value={(newList && newList.name || recipeDataObject.data && recipeDataObject.data.name)}
                        width="20%"
                    />
                    <UU5.Forms.Text
                        name="author"
                        label={<UU5.Bricks.Lsi lsi={{en: "Author", cs: "Autor"}}/>}
                        readOnly
                        value={(newList && newList.author || recipeDataObject.data && recipeDataObject.data.author)}
                    />
                    <UU5.Forms.Text
                        name="difficulty"
                        label={<UU5.Bricks.Lsi lsi={{en: "Difficulty", cs: "Náročnost"}}/>}
                        readOnly
                        value={(newList && newList.difficulty || recipeDataObject.data && recipeDataObject.data.difficulty)}
                    />
                    <UU5.Forms.Number
                        name="preparationTime"
                        label={<UU5.Bricks.Lsi lsi={{en: "Preparation time", cs: "Čas na přípravu"}}/>}
                        readOnly
                        value={(newList && newList.preparationTime || recipeDataObject.data && recipeDataObject.data.preparationTime)}
                    />
                    <UU5.Forms.TextArea
                        name="instructions"
                        label={<UU5.Bricks.Lsi lsi={{en: "Instructions", cs: "Instrukce"}}/>}
                        readOnly
                        value={(newList && newList.instructions || recipeDataObject.data && recipeDataObject.data.instructions)}
                    />
                </UU5.Bricks.Div>
            )
        }

        function ingredientComponent(){
            let ingredientComp = []
            if(newList && newList.ingredientObjectList) {
                newList && newList.ingredientObjectList && newList.ingredientObjectList.forEach(index => {
                    ingredientComp.push(
                        <UU5.Bricks.Div>
                        <UU5.Forms.Text
                            name={index.name}
                            label={index.name}
                            readOnly
                            value={(newList.ingredientList[index.id] + " " + index.measure)}
                        />
                        </UU5.Bricks.Div>
                    )
                })
            } else if(recipeDataObject.data && recipeDataObject.data.ingredientObjectList) {
                recipeDataObject.data && recipeDataObject.data.ingredientObjectList && recipeDataObject.data.ingredientObjectList.forEach(index => {
                    ingredientComp.push(
                        <UU5.Bricks.Div>
                        <UU5.Forms.Text
                            name={index.name}
                            label={index.name}
                            readOnly
                            value={(recipeDataObject.data.ingredientList[index.id] + " " + index.measure)}
                        />
                        </UU5.Bricks.Div>
                    )
                })
            }


            return(ingredientComp);

        }

        
        console.log(props);
        //console.log(newList.data);
        //@@viewOff:private

        //@@viewOn:interface
        //@@viewOff:interface

        //@@viewOn:render
        const attrs = UU5.Common.VisualComponent.getAttrs(props);
        return (
            <div {...attrs}>
            <UU5.BlockLayout.Block>
            <UU5.BlockLayout.Row className="row">
                <UU5.Forms.Slider
                    labelColWidth={"xs-12 s-12 m4 l4 xl4"}
                    inputColWidth={"xs-12 s-12 m6 l6 xl6"}
                    label="Počet drinků"
                    message="Zvolte počet drinků pro přepočet receptu"
                    size="l"
                    min={1}
                    max={100}
                    step={1}
                    onChange={opt => recipeRecalculation(opt)}
                    controlled={false}
                    />
                {tableRecipe()} 
                {ingredientComponent()}  
            </UU5.BlockLayout.Row>
            </UU5.BlockLayout.Block> 
            </div>
        );
        
        //@@viewOff:render
    }
});

export default Recipe;
