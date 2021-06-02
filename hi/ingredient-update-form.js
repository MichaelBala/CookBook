//@@viewOn:imports
import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import {createVisualComponent, useDataList} from "uu5g04-hooks";
import Calls from "calls";
//@@viewOff:imports

const STATICS = {
    //@@viewOn:statics
    displayName: "IngredientUpdateForm",
    //@@viewOff:statics
};

const CLASS_NAMES = {
    welcomeRow: () => Config.Css.css``,
};

export const IngredientUpdateForm = createVisualComponent({
    ...STATICS,

    //@@viewOn:propTypes
    propTypes: {
        createItem: UU5.PropTypes.func,
        setSelectedIngredientData: UU5.PropTypes.func,
        selectedIngredientData: UU5.PropTypes.object
    },
    //@@viewOff:propTypes

    //@@viewOn:defaultProps
    //@@viewOff:defaultProps

    render(props) {
        //@@viewOn:private
        function onSave(opt) {
            if (props.selectedIngredientData && props.selectedIngredientData.data && props.selectedIngredientData.data.id) {
                props.selectedIngredientData.handlerMap.update({data: opt.values})
            } else {
                props.createItem({data: opt.values})
            }
            props.setSelectedIngredientData(null)
        }

        //@@viewOff:private

        //@@viewOn:interface
        //@@viewOff:interface

        //@@viewOn:render
        const attrs = UU5.Common.VisualComponent.getAttrs(props);
        let selectedIngredientData = props.selectedIngredientData && props.selectedIngredientData.data || {}

        return (
            <div {...attrs} className={"uu5-common-padding-s"}>
                <UU5.Forms.Form
                    onSave={onSave}
                    onCancel={() => props.setSelectedIngredientData(null)}
                    header={selectedIngredientData && selectedIngredientData.id
                        ? <UU5.Bricks.Lsi lsi={{en: "Update Ingredient", cs: "Upravit ingredienci"}}/>
                        : <UU5.Bricks.Lsi lsi={{en: "Create Ingredient", cs: "Vytvořit ingredienci"}}/>
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
                        required
                        value={selectedIngredientData && selectedIngredientData.id}
                        readOnly={selectedIngredientData && selectedIngredientData.id}
                    />
                    <UU5.Forms.Text
                        name="name"
                        label={<UU5.Bricks.Lsi lsi={{en: "Name", cs: "Název"}}/>}
                        placeholder="Some text..."
                        required
                        value={selectedIngredientData && selectedIngredientData.name}
                    />
                    <UU5.Bricks.Line size={"s"}/>
                    <UU5.Forms.Controls/>
                </UU5.Forms.Form>
            </div>
        );
        //@@viewOff:render
    },
});

export default IngredientUpdateForm;
