//@@viewOn:imports
import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import {createVisualComponent, useCall, useEffect} from "uu5g04-hooks";
import Calls from "calls";
//@@viewOff:imports

const STATICS = {
    //@@viewOn:statics
    displayName: "BookUpdateForm",
    //@@viewOff:statics
};

const CLASS_NAMES = {
    welcomeRow: () => Config.Css.css``,
};

export const BookUpdateForm = createVisualComponent({
    ...STATICS,

    //@@viewOn:propTypes
    propTypes: {
        createItem: UU5.PropTypes.func,
        setAddBookImageData: UU5.PropTypes.func,
        addBookImageData: UU5.PropTypes.object
    },
    //@@viewOff:propTypes

    //@@viewOn:defaultProps
    //@@viewOff:defaultProps

    render(props) {
        //@@viewOn:private
        let bookImageCreateCall = useCall(Calls.bookImageCreate);

        function onSave(opt) {
            bookImageCreateCall.call(
                {data: {code: props.addBookImageData.data.id, data: opt.values.data}}
            )
        }

        useEffect(() => {
                if (bookImageCreateCall.viewState === "ready" && bookImageCreateCall.data) {
                    location.reload()
                }
            },
            [bookImageCreateCall.viewState]
        )

        //@@viewOff:private

        //@@viewOn:interface
        //@@viewOff:interface

        //@@viewOn:render
        const attrs = UU5.Common.VisualComponent.getAttrs(props);
        let addBookImageData = props.addBookImageData && props.addBookImageData.data || {}

        return (
            <div {...attrs} className={"uu5-common-padding-s"}>
                <UU5.Forms.Form
                    onSave={onSave}
                    onCancel={() => props.setAddBookImageData(null)}
                    header={<UU5.Bricks.Lsi lsi={{en: "Add Cover", cs: "Přidat obal"}}/>}
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
                        value={addBookImageData && addBookImageData.id}
                        readOnly={true}
                    />
                    <UU5.Forms.Text
                        name="name"
                        label={<UU5.Bricks.Lsi lsi={{en: "Name", cs: "Název"}}/>}
                        placeholder="Some text..."
                        required
                        value={addBookImageData && addBookImageData.name}
                        readOnly={true}
                    />
                    <UU5.Forms.File
                        name="data"
                        label={<UU5.Bricks.Lsi lsi={{en: "Cover", cs: "Obal"}}/>}
                        required
                    />
                    <UU5.Bricks.Line size={"s"}/>
                    <UU5.Forms.Controls/>
                </UU5.Forms.Form>
            </div>
        );
        //@@viewOff:render
    },
});

export default BookUpdateForm;
