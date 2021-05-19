//@@viewOn:imports
import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import {createVisualComponent, useDataList, useState} from "uu5g04-hooks";
import Uu5Tiles from "uu5tilesg02";
import BookUpdateForm from "bookUpdateForm";
import BookImageForm from "bookImageForm";
import Calls from "calls";
//@@viewOff:imports

const STATICS = {
    //@@viewOn:statics
    displayName: "BookList",
    //@@viewOff:statics
};

const CLASS_NAMES = {
    welcomeRow: () => Config.Css.css``,
};

export const BookList = createVisualComponent({
    ...STATICS,

    //@@viewOn:propTypes
    //@@viewOff:propTypes

    //@@viewOn:defaultProps
    //@@viewOff:defaultProps

    render(props) {
        //@@viewOn:private
        const dataListResult = useDataList({
            handlerMap: {
                load: Calls.listBooks,
                createItem: Calls.createBook
            },
            itemHandlerMap: {
                update: Calls.updateBook,
                delete: Calls.deleteBook
            },
            initialDtoIn: {data: {}}
        });
        const authorListResult = useDataList({
            handlerMap: {
                load: Calls.listAuthors,
            },
            initialDtoIn: {data: {}}
        });
        const authorMap = {};
        if (authorListResult.data) {
            authorListResult.data.forEach(author => authorMap[author.data.id] = author.data)
        }

        const [selectedBookData, setSelectedBookData] = useState(null)
        const [addBookImageData, setAddBookImageData] = useState(null)

        const columns = [
            {
                cell: cellProps => {
                    return (
                        <UU5.Bricks.Image
                            alt={""}
                            src={"http://localhost:3000/bookImage/get?code=" + cellProps.data.data.id}
                            type={"rounded"}
                            style={{maxHeight: "60px"}}
                        />
                    )
                },
                header: <UU5.Bricks.Lsi lsi={{en: "Cover", cs: "Obal"}}/>,
                width: "60px"
            },
            {
                cell: cellProps => {
                    return cellProps.data.data.id
                },
                header: "ISBN",
                width: "200px"
            },
            {
                cell: cellProps => cellProps.data.data.name,
                header: <UU5.Bricks.Lsi lsi={{en: "Name", cs: "Název"}}/>
            },
            {
                cell: cellProps => {
                    let result = [];
                    cellProps.data.data.authorList.forEach(authorId => result.push(authorMap[authorId] && authorMap[authorId].name))
                    return result.join(", ")
                },
                header: <UU5.Bricks.Lsi lsi={{en: "Authors", cs: "Autoři"}}/>
            },
            {
                cell: cellProps => {
                    return (
                        <div className={"right"}>
                            <UU5.Bricks.Button
                                content={<UU5.Bricks.Icon icon={"mdi-book-open"}/>}
                                onClick={() => showBook(cellProps.data.data.id)}
                                bgStyle={"transparent"}
                            />
                            <UU5.Bricks.Button
                                content={<UU5.Bricks.Icon icon={"mdi-pencil"}/>}
                                colorSchema={"blue"}
                                bgStyle={"transparent"}
                                onClick={() => setSelectedBookData(cellProps.data)}
                            />
                            <UU5.Bricks.Button
                                content={<UU5.Bricks.Icon icon={"mdi-file-image"}/>}
                                colorSchema={"blue"}
                                bgStyle={"transparent"}
                                onClick={() => setAddBookImageData(cellProps.data)}
                                tooltip={{en: "add cover", cs: "přidat obal"}}
                            />
                            <UU5.Bricks.Button
                                content={<UU5.Bricks.Icon icon={"mdi-delete"}/>}
                                colorSchema={"red"}
                                bgStyle={"transparent"}
                                onClick={() => cellProps.data.handlerMap.delete({data: {id: cellProps.data.data.id}})}
                            />
                        </div>
                    )
                },
                width: 150
            },
        ];

        function getChild() {
            let child;
            switch (dataListResult.state) {
                case "pendingNoData":
                case "pending":
                    child = <UU5.Bricks.Loading/>
                    break;
                case "readyNoData":
                case "ready":
                    child = (
                        <Uu5Tiles.List
                            height="auto"
                            data={dataListResult.data}
                            columns={columns}
                            rowHeight={"76px"}
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

        function showBook(id) {
            UU5.Environment.getRouter().setRoute("book", {id: id})
        }

        //@@viewOff:private

        //@@viewOn:interface
        //@@viewOff:interface

        //@@viewOn:render
        const attrs = UU5.Common.VisualComponent.getAttrs(props);
        return (
            <div {...attrs} className={"uu5-common-padding-s"}>
                <UU5.Bricks.Modal offsetTop={100} shown={selectedBookData}>
                    <BookUpdateForm
                        createItem={dataListResult.handlerMap.createItem}
                        setSelectedBookData={setSelectedBookData}
                        selectedBookData={selectedBookData}
                    />
                </UU5.Bricks.Modal>
                <UU5.Bricks.Modal offsetTop={100} shown={addBookImageData}>
                    <BookImageForm
                        setAddBookImageData={setAddBookImageData}
                        addBookImageData={addBookImageData}
                    />
                </UU5.Bricks.Modal>
                <UU5.Bricks.Header content={<UU5.Bricks.Lsi lsi={{en: "Book List", cs: "Seznam knih"}}/>} level={3}/>
                <div className={"right"}>
                    <UU5.Bricks.Button
                        content={<UU5.Bricks.Lsi lsi={{en: "Create Book", cs: "Vytvořit knihu"}}/>}
                        colorSchema={"green"}
                        onClick={() => setSelectedBookData({data: {}})}
                    />
                </div>
                {getChild()}
            </div>
        );
        //@@viewOff:render
    },
});

export default BookList;
