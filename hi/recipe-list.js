//@@viewOn:imports
import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import {createVisualComponent, useDataList, useState} from "uu5g04-hooks";
import Uu5Tiles from "uu5tilesg02";
import RecipeUpdateForm from "recipeUpdateForm";
import RecipeImageForm from "recipeImageForm";
import Calls from "calls";
//@@viewOff:imports

const STATICS = {
    //@@viewOn:statics
    displayName: "RecipeList",
    //@@viewOff:statics
};

const CLASS_NAMES = {
    welcomeRow: () => Config.Css.css``,
};

export const RecipeList = createVisualComponent({
    ...STATICS,

    //@@viewOn:propTypes
    //@@viewOff:propTypes

    //@@viewOn:defaultProps
    //@@viewOff:defaultProps

    render(props) {
        //@@viewOn:private
        const dataListResult = useDataList({
            handlerMap: {
                load: Calls.listRecipes,
                createItem: Calls.createRecipe
            },
            itemHandlerMap: {
                update: Calls.updateRecipe,
                delete: Calls.deleteRecipe
            },
            initialDtoIn: {data: {}}
        });
        const ingredientListResult = useDataList({
            handlerMap: {
                load: Calls.listIngredients,
            },
            initialDtoIn: {data: {}}
        });
        const ingredientMap = {};
        if (ingredientListResult.data) {
            ingredientListResult.data.forEach(ingredient => ingredientMap[ingredient.data.id] = ingredient.data)
        }

        const [selectedRecipeData, setSelectedRecipeData] = useState(null)
        const [addRecipeImageData, setAddRecipeImageData] = useState(null)
        const [text, setText] = useState("")
        const [ingredientFilterList, setIngredientFilter] = useState([])

        //console.log(ingredientFilterList);

        const columns = [
            {
                cell: cellProps => {
                    return (
                        <UU5.Bricks.Image
                            alt={""}
                            src={"http://localhost:3000/recipeImage/get?code=" + cellProps.data.data.id}
                            type={"rounded"}
                            style={{maxHeight: "60px"}}
                        />
                    )
                },
                header: <UU5.Bricks.Lsi lsi={{en: "Image", cs: "Foto"}}/>,
                width: "60px"
                
            },
            //// ID bych nezobrazoval, ale rad???? jen zakomentov??v??m
           /*  {
                cell: cellProps => {
                    return cellProps.data.data.id
                },
                header: "ID",
                width: "200px"
            }, */
            {
                cell: cellProps => cellProps.data.data.name,
                header: <UU5.Bricks.Lsi lsi={{en: "Recipe", cs: "Recept"}}/>
            },
            {
                cell: cellProps => cellProps.data.data.author,
                header: <UU5.Bricks.Lsi lsi={{en: "Author", cs: "Autor"}}/>
            },
            /// seznam ingredienc?? nebudeme pravd??podobn?? vypisovat, proto zakomentov??no - fin??ln?? smazat
            /* {
                cell: cellProps => {
                    let result = [];
                    cellProps.data.data.authorList.forEach(authorId => result.push(authorMap[authorId] && authorMap[authorId].name))
                    return result.join(", ")
                },
                header: <UU5.Bricks.Lsi lsi={{en: "Authors", cs: "Auto??i"}}/>
            }, */
            {
                cell: cellProps => cellProps.data.data.difficulty,
                header: <UU5.Bricks.Lsi lsi={{en: "Difficulty", cs: "N??ro??nost"}}/>
            },
            {
                cell: cellProps => cellProps.data.data.preparationTime + "m",
                header: <UU5.Bricks.Lsi lsi={{en: "Preparation time", cs: "??as na p????pravu"}}/>
            },
            {
                cell: cellProps => {
                    return (
                        <div className={"right"}>
                            <UU5.Bricks.Button
                                content={<UU5.Bricks.Icon icon={"mdi-book-open"}/>}
                                onClick={() => showRecipe(cellProps.data.data.id)}
                                bgStyle={"transparent"}
                            />
                            <UU5.Bricks.Button
                                content={<UU5.Bricks.Icon icon={"mdi-pencil"}/>}
                                colorSchema={"blue"}
                                bgStyle={"transparent"}
                                onClick={() => setSelectedRecipeData(cellProps.data)}
                            />
                            <UU5.Bricks.Button
                                content={<UU5.Bricks.Icon icon={"mdi-file-image"}/>}
                                colorSchema={"blue"}
                                bgStyle={"transparent"}
                                onClick={() => setAddRecipeImageData(cellProps.data)}
                                tooltip={{en: "add cover", cs: "p??idat obal"}}
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
                width: 200
            },
        ];

        function getChild() {
            let child;

            var results = new Set();
            let toSearch = text.replace(" ","").toLowerCase();
            let toSearchIngredient = ingredientFilterList;

            switch (dataListResult.state) {
                case "pendingNoData":
                case "pending":
                    child = <UU5.Bricks.Loading/>
                    break;
                case "readyNoData":
                case "ready":
                for(var i=0; i< dataListResult.data.length; i++) {
                    Object.keys(dataListResult.data[i].data).forEach(function(index){
                        //console.log(dataListResult.data[i].data[index])
                        if (toSearchIngredient.length != 0){
                            Object.keys(dataListResult.data[i].data["ingredientList"]).forEach(function(index){
                                toSearchIngredient.forEach(element => {
                                    if(index == element){         
                                        results.add(dataListResult.data[i])
                                    } 
                                });
                            })
                        } 
                        if(toSearchIngredient.length === 0 && dataListResult.data[i].data[index].toLowerCase && dataListResult.data[i].data[index].toLowerCase().indexOf(toSearch)!=-1) {
                            results.add(dataListResult.data[i])                        
                        }
                    })
                }

                child = (
                    <Uu5Tiles.List
                        height="auto"
                        data={[...results]}
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

        function showRecipe(id) {
            UU5.Environment.getRouter().setRoute("recipe", {id: id})
        }

        let ingredientList = [];
        
        ingredientListResult.data && ingredientListResult.data.forEach(ingredient => {

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
        

/*         function loadIngredients(recipeObj) {
            return Object.keys(recipeObj.ingredientList)
        }
 */
        
        //@@viewOff:private

        //@@viewOn:interface
        //@@viewOff:interface

        //@@viewOn:render
        const attrs = UU5.Common.VisualComponent.getAttrs(props);
        return (
            <div {...attrs} className={"uu5-common-padding-s"}>
                <UU5.Bricks.Modal offsetTop={100} shown={selectedRecipeData}>
                    <RecipeUpdateForm
                        createItem={dataListResult.handlerMap.createItem}
                        setSelectedRecipeData={setSelectedRecipeData}
                        selectedRecipeData={selectedRecipeData}
                    />
                </UU5.Bricks.Modal>
                <UU5.Bricks.Modal offsetTop={100} shown={addRecipeImageData}>
                    <RecipeImageForm
                        setAddRecipeImageData={setAddRecipeImageData}
                        addRecipeImageData={addRecipeImageData}
                    />
                </UU5.Bricks.Modal>
                <UU5.Bricks.Header content={<UU5.Bricks.Lsi lsi={{en: "Recipe List", cs: "Seznam recept??"}}/>} level={3}/>
                <div className={"right"}>
                    <UU5.Bricks.Button
                        content={<UU5.Bricks.Lsi lsi={{en: "Create Recipe", cs: "Vytvo??it recept"}}/>}
                        colorSchema={"green"}
                        onClick={() => setSelectedRecipeData({data: {}})}
                    />
                </div>
                <table width="80%">
                    <tr>
                        <td>
                            <div className={"left"}>
                                <UU5.Forms.TextButton
                                    label={<UU5.Bricks.Lsi lsi={{en: "Search", cs: "Vyhledat"}}/>}
                                    size="m"
                                    buttons={[{
                                        icon: 'mdi-magnify',
                                        onClick: (opt) => setText(opt.value),
                                        colorSchema: 'info',
                                    }]}
                                    controlled={false}
                                />
                            </div>
                        </td>
                        <td width="40%">
                            <div>
                                <UU5.Forms.Select
                                        name="ingredientList"
                                        label={<UU5.Bricks.Lsi lsi={{en: "Ingredients", cs: "Ingredience"}}/>}
                                        multiple={true}
                                        //reguired
                                        value={ingredientFilterList}
                                        onChange={(opt) => {
                                            setIngredientFilter((currentState) => {
                                                let index = currentState.indexOf(opt.value)
                                                if(index === -1){
                                                    currentState.push(opt.value);
                                                } else {
                                                    currentState.splice(index,1);
                                                }
                                                return currentState.slice();
                                            })
                                        }}
                                    >
                                        {ingredientList}
                                </UU5.Forms.Select>
                            </div>
                        </td>
                    </tr>
                </table>              
                {getChild()}
            </div>
        );
        //@@viewOff:render
    },
});

export default RecipeList;
