const itemsCount = 5;
let List = [];
let id = 0;
$(() => {
    const getTasksList = (numberPage) => {
        fetch('http://localhost:8000/all').then(res => res.json()).then((res) => {
            List = res;
             if (List.length > 0) {
                let list = List.map((item, index) => {
                    item.checked = (item.checked === true);
                    return `<li id="item_${item.id}" class="${"task" + " d-flex"}">
                                <div class="${"task__label " + "input-group-prepend"}">
                                    <button type="button" class="${"task__delete " + "btn"}">Удалить</button>
                                    <input type="checkbox" class="task__checkbox" checked="${item.checked}">
                                </div>
                                <div class="app__text">
                                    <div class="task__textwrapper">${item.text}</div>
                                </div>
                            </li>`;
                });
                const result = $("#tasksList");
                result.html("");
                result.append(list);
                 updateId();
                 id = List.length;
                 render(numberPage);
            }
        }).catch(error => console.log(error));
    }

    const render = (page) => {
        let thisArr = filteredList();
        const thisPage = changePage(page, thisArr);
        thisArr = getPaginationPage(thisPage, thisArr);
        rebuildTags(thisArr);
        updateCount();
    }

    const addTask = () => {
        const taskText = $("#inputTask").val();
        if (taskText != '') {
            let data = {id: "item_"+id, text: taskText, checked: false};
            fetch(`http://localhost:8000/add-item`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}).then((res) => {
                id++;
                $("#inputTask").val("");
                getTasksList();
            });
            return List.push({id: "item_"+id, text: taskText, checked: false});
        }
    }

    const filteredList = () => {
        const thisValue = $(".state__link.active").prop("id");
        const checkStatus = (thisValue === "completed") ? true : false;
        let result = (thisValue === "all") ?  (List) : (List.filter((item) => { return item.checked === checkStatus;}));
        return result;
    }

    const changePage = (activePage, arr = List) => {
        const pages = Math.ceil(arr.length / itemsCount);
        let tagsPagination = '';
        let onePage = 1;
        let thisPage = onePage;
        thisPage = (activePage) ? ((activePage === "lastPage") ? pages : activePage ) : +$(".pagination__link.pagination__link_active").attr("id");
        if (thisPage > pages) {
            thisPage = pages;
        }
        while(onePage <= pages) {
            const className = (onePage === thisPage) ? "pagination__link pagination__link_active" : "pagination__link"
            tagsPagination += `<li class="${className}" id="${onePage}">${onePage}</li>`;
            onePage++;
        }

        $("#pagination").html(tagsPagination);
        return thisPage;
    }

    const getPaginationPage = (numberPage, arr = List) => {
        let start = arr.length - (arr.length - itemsCount * (numberPage - 1));
        let end = ((start + itemsCount) < arr.length) ? (start + itemsCount) : (arr.length);
        const result = _.slice(arr, start, end);
        return result;
    }

    const rebuildTags = (arr = List) => {
        let items = arr.map((item) => {
            const { id: itemId, text: itemText, checked: itemChecked } = item;
            const status = itemChecked ? "checked" : "";
            const taskClass = itemChecked ? "app__text" : "";
            return `<li id="${itemId}" class="${"task" + " d-flex"}">
                                <div class="${"task__label " + "input-group-prepend"}">
                                    <button type="button" class="${"task__delete " + "btn"}">Удалить</button>
                                    <input type="checkbox" class="task__checkbox" ${status}>
                                </div>
                                <div class="${"app__text" + " " + taskClass}">
                                    <div class="task__textwrapper">${itemText}</div>
                                </div>
                            </li>`;
        });
        const list = $("#tasksList");
        list.html("");
        list.append(items);
    }

    const updateCount = () => {
        const all = List.length;
        const checked = _.filter(List, item => { return item.checked; }).length;
        const unchecked= all - checked;
        $("#counterLabelAll").siblings(".counter__value").prop("id", all);
        $("#counterLabelChecked").siblings(".counter__value").prop("id", checked);
        $("#counterLabelUnchecked").siblings(".counter__value").prop("id", unchecked);
        $("#counterLabelAll").siblings(".counter__value").text(all);
        $("#counterLabelChecked").siblings(".counter__value").text(checked);
        $("#counterLabelUnchecked").siblings(".counter__value").text(unchecked);
        const check = (checked && checked === all);
        $("#select_all").attr("checked", check);

    }

    const updateId = () => {
        List.map((item, index) => {
            item.id = 'item_'+index;
        });
    }

    const getItem = (event) => {
        return parseInt(event.currentTarget.parentElement.parentElement.id.replace('item_', ''));
    }

    const checkboxHandler = (event) => {
        const item = List[getItem(event)];
        List[getItem(event)].checked = !List[getItem(event)].checked;
        let data = List[getItem(event)];
        fetch(`http://localhost:8000/update-item-checked/${item._id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then((res) => {
            getTasksList();
        });
    }

    const changeState = (state) => {
        List.map((item) => {
            item.checked = state;
        });
    }

    const selectAll = (event) => {
        changeState(event.target.checked);
        let data =  {checked: event.target.checked};
        fetch(`http://localhost:8000/select-all`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then((res) => {
            getTasksList();
        });
    }

    const deleteChosenItem = (item) => {
        let temp =  List[item];
        fetch(`http://localhost:8000/delete-item/${temp._id}`, {method: 'POST'}).then((res) => {
            getTasksList();
        });
       return _.pull(List, _.find(List, { id: item }));
    }

    const deleteItemHandler = (event) => {
        deleteChosenItem(getItem(event));
        updateId();
        render();
    }

    const deleteAllHandler = () => {
         List = _.differenceWith(List, _.filter(List, item => { return item.checked; }), _.isEqual);
        // render();
        fetch(`http://localhost:8000/delete-checked`, {
            method: 'POST',
        }).then((res) => {
            getTasksList();
            render();
        });
    }

    const changeTasksTextHandler = (event) => {
        const itemTag = event.currentTarget.parentElement;
        const oldText = event.currentTarget.innerText;
        $(itemTag).html(`<input class="item__old-text" type="text" value="${oldText}" />`);
        $(".item__old-text").focus();
    }

    const updateTaskText = (event) => {
        const item = _.find(List, List[getItem(event)]);
        const oldText = item.text;
        const newText = $(".item__old-text").val().trim();
        item.text = newText ? newText : oldText;
        let data = item;
        fetch(`http://localhost:8000/update-item-checked/${item._id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then((res) => {
            getTasksList();
        });
        render();
    }


    function switchLinks() {
        $(".state__link.active").removeClass("active");
        $(this).addClass("active");
        render(1);
    }

    function switchPagination() {
        $(".pagination__link.pagination__link_active").removeClass("pagination__link_active");
        $(this).addClass("pagination__link_active");
        render();
    }

    getTasksList(1);


    $("#addButton").on("click", () => {
        addTask();
    });

    $("#inputTask").keypress((event) => {
        if (event.which === 13) {
            addTask();
        }
    });

    $('body').on("click", "#selectAllTask", (event) => {
        selectAll(event);
    });

    $("#deleteAllButton").click(deleteAllHandler);

    $('body').on("change", ".task__checkbox", (event) => {
        checkboxHandler(event);
    });

    $('body').on("click", ".task__delete", (event) => {
        deleteItemHandler(event);
    });

    $('body').on("dblclick", ".task__textwrapper", (event) => {
       changeTasksTextHandler(event);
    });

    $('body').on("keyup", ".item__old-text", (event) => {
        if (event.which === 13) {
            updateTaskText(event);
        }
    });

    $('body').on("blur", ".item__old-text", (event) => {
        updateTaskText(event);
    });

    $('body').on("click", ".state__link", switchLinks);

    $('body').on("click", `.pagination__link`, switchPagination);
});