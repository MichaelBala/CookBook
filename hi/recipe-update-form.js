//@@viewOn:imports
import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import {createVisualComponent, useDataList} from "uu5g04-hooks";
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
        //@@viewOn:private
        const dataListResult = useDataList({
            handlerMap: {
                load: Calls.Ingredients,
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
                        content={ingredient.data.name}
                    />
                )
            }
        })

        function onSave(opt) {
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
                    onCancel={() => props.setSelectedRecipeData(null)}
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
                    <UU5.Forms.Select
                        name="ingredientList"
                        label={<UU5.Bricks.Lsi lsi={{en: "Ingredients", cs: "Ingredience"}}/>}
                        multiple={true}
                        reguired
                        value={selectedRecipeData && selectedRecipeData.ingredientList}
                    >
                       
                        {ingredientList}
                    </UU5.Forms.Select>
                    <UU5.Bricks.Line size={"s"}/>
                    <UU5.Forms.Controls/>
                </UU5.Forms.Form>
            </div>
            
        );
        
        //@@viewOff:render
    },
});

export default RecipeUpdateForm;
