var List = [];
// const getTasksList = () => {
//     fetch('http://localhost:8000/all').then(res => res.json()).then((res) => {
//         List = res;
//         console.log(List);
//     }).catch(error => console.log(error));
//     if (List.length > 0) {
//         let list = List.map((item, index) => {
//             return `<li id="${item._id}" class="${"task" + " d-flex"}">
//                                 <div class="${"task__label " + "input-group-prepend"}">
//                                     <button type="button" class="${"task__delete " + "btn"}">Удалить</button>
//                                     <input type="checkbox" class="task__checkbox" ${status}>
//                                 </div>
//                                 <div class="app__text">
//                                     <div class="task__textwrapper">${item.text}</div>
//                                 </div>
//                             </li>`;
//         })
//         const result = $("#tasksList");
//         result.html("");
//         result.append(list);
//     }
//    // render();
// }
// getTasksList();

