//@@viewOn:imports

import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import {createVisualComponent, useDataObject} from "uu5g04-hooks";
import RecipeUpdateForm from "recipeUpdateForm";
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
        let newList = recipeDataObject.data;

        //@@viewOff:private

        //@@viewOn:interface
        //@@viewOff:interface

        //@@viewOn:render
        const attrs = UU5.Common.VisualComponent.getAttrs(props);
        return (
            <div {...attrs}>
                <UU5.Bricks.Button content={"ingredient"} onClick={() => UU5.Environment.getRouter().setRoute("ingredient")} />
                    
                <UU5.Forms.Slider
                    label="Počet drinků"
                    name = "input"
                    message="Zvolte počet drinků pro přepočet receptu"
                    size="l"
                    min={0}
                    max={100}
                    step={1}
                    onChange={opt => {
                        opt.component.onChangeDefault(opt)
                        let value = opt.value;
                       // console.log(recipeDataObject.data.ingredientList)
                        Object.keys(newList.ingredientList).forEach(function(index){
                            newList.ingredientList[index] *= value;
                        });
                        
                        console.log(newList)
                    }} 
                    />
                    
               <pre>{JSON.stringify(newList || {}, null, 2)}</pre>
            </div>
            
        );
        //@@viewOff:render
    },
});

export default Recipe;
