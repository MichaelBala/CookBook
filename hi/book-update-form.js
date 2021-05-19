//@@viewOn:imports
import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import {createVisualComponent, useDataList} from "uu5g04-hooks";
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
        setSelectedBookData: UU5.PropTypes.func,
        selectedBookData: UU5.PropTypes.object
    },
    //@@viewOff:propTypes

    //@@viewOn:defaultProps
    //@@viewOff:defaultProps

    render(props) {
        //@@viewOn:private
        const dataListResult = useDataList({
            handlerMap: {
                load: Calls.listAuthors,
            },
            initialDtoIn: {data: {}}
        });

        let authorList = [];
        dataListResult.data && dataListResult.data.forEach(author => {
            if (author.data.approved) {
                authorList.push(
                    <UU5.Forms.Select.Option
                        key={author.data.id}
                        value={author.data.id}
                        content={author.data.name}
                    />
                )
            }
        })

        function onSave(opt) {
            if (props.selectedBookData && props.selectedBookData.data && props.selectedBookData.data.id) {
                props.selectedBookData.handlerMap.update({data: opt.values})
            } else {
                props.createItem({data: opt.values})
            }
            props.setSelectedBookData(null)
        }

        //@@viewOff:private

        //@@viewOn:interface
        //@@viewOff:interface

        //@@viewOn:render
        const attrs = UU5.Common.VisualComponent.getAttrs(props);
        let selectedBookData = props.selectedBookData && props.selectedBookData.data || {}

        return (
            <div {...attrs} className={"uu5-common-padding-s"}>
                <UU5.Forms.Form
                    onSave={onSave}
                    onCancel={() => props.setSelectedBookData(null)}
                    header={selectedBookData && selectedBookData.id
                        ? <UU5.Bricks.Lsi lsi={{en: "Update Book", cs: "Upravit knihu"}}/>
                        : <UU5.Bricks.Lsi lsi={{en: "Create Book", cs: "Vytvořit knihu"}}/>
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
                        value={selectedBookData && selectedBookData.id}
                        readOnly={selectedBookData && selectedBookData.id}
                    />
                    <UU5.Forms.Text
                        name="name"
                        label={<UU5.Bricks.Lsi lsi={{en: "Name", cs: "Název"}}/>}
                        placeholder="Some text..."
                        required
                        value={selectedBookData && selectedBookData.name}
                    />
                    <UU5.Forms.Select
                        name="authorList"
                        label={<UU5.Bricks.Lsi lsi={{en: "Authors", cs: "Autoři"}}/>}
                        multiple={true}
                        reguired
                        value={selectedBookData && selectedBookData.authorList}
                    >
                        {authorList}
                    </UU5.Forms.Select>
                    <UU5.Bricks.Line size={"s"}/>
                    <UU5.Forms.Controls/>
                </UU5.Forms.Form>
            </div>
        );
        //@@viewOff:render
    },
});

export default BookUpdateForm;
