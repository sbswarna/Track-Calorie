//Storage Controller
const StorageCtrl = (function () {

  return {
    storeItem: function (item) {
      let items;
      if(localStorage.getItem('items') === null) { //if local strorage is empty
        items = [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      } else { //if not
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getStorageItems: function () {
      let items;
      if(localStorage.getItem('items') === null) { //if local strorage is empty
        items = [];
      } else { //if not
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateStorageItem: function (itemToUpdate) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function (item, index) {
        if(item.id == itemToUpdate.id) {
          items.splice(index, 1, itemToUpdate);
        }
      })
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteStorageItem: function (itemToDelete) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function (item, index) {
        if(parseInt(item.id) == itemToDelete.id) {
          items.splice(index, 1);
        }
      })
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteAllStorageItem: function () {
      // let items = JSON.parse(localStorage.getItem('items'));
      // items = [];
      // localStorage.setItem('items', JSON.stringify(items));
      localStorage.removeItem('items');
    }
  }
})();


//Item Controller
const ItemCtrl = (function () {
  const item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //data structure for items
  const data = {
    items: StorageCtrl.getStorageItems(),
    totalCalories: 0,
    currentItem: null,
  };

  return {
    //to get data items
    getItems: function () {
      return data.items;
    },
    //to add new item
    addItem: function (name, calories) {
      const nextID = data.items.length + 1;
      //console.log(nextID);
      calories = parseInt(calories);
      const newItem = new item(nextID, name, calories);
      data.items.push(newItem);
      //console.log(data);
      return newItem;
    },
    //to display data items
    logData: function () {
      return data;
    },
    //to get total calories
    getTotalCalories: function () {
      const items = data.items;
      data.totalCalories = 0;
      items.forEach((item) => (data.totalCalories += item.calories));
      return data.totalCalories;
    },
    itemToEdit: function (id) {
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
        // console.log(item);
        // console.log(id);
      });
      //console.log(found);
      return found;
    },

    //set current item for editing
    setCurrenItem: function (itemToEdit) {
      data.currentItem = itemToEdit;
      //console.log(data.currentItem);
    },
    //get current item
    getCurrenItem: function () {
      return data.currentItem;
    },

    //set updated item
    setItem: function (updateditem) {
      const calories = parseInt(updateditem.calories);
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = updateditem.name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    removeItemFromData: function () {
      const ids = data.items.map(function (item) {
        return item.id;
      });
      const index = ids.indexOf(data.currentItem.id);
      data.items.splice(index, 1);
    },

    //clear all items from data
    clearAllItems: function () {
      data.items = [];
    }
  };
})();

//UI Controller
const UICtrl = (function () {
  const UISelector = {
    nodelist: "#item-list li",
    itemlist: "item-list",
    itemname: "#item-name",
    itemcalories: "#item-calories",
    tCalories: ".total-calories",

    addbtn: ".add-btn",
    deletebtn: ".delete-btn",
    updatebtn: ".update-btn",
    backbtn: ".back-btn",
    clearbtn: ".clear-btn",

    editItem: ".edit-item",
  };
  return {
    //to show items in the ui list
    populateItemList: function (items) {
      let html = "";
      items.forEach((item) => {
        html += `<li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>
        </li>`;
      });
      document.getElementById(UISelector.itemlist).innerHTML = html;
    },
    //to get ui selectors declared here
    getSelectors: function () {
      return UISelector;
    },
    //gets the input from the ui
    getItemInput: function () {
      return {
        name: document.querySelector(UISelector.itemname).value,
        calories: document.querySelector(UISelector.itemcalories).value,
      };
    },
    //to add item to the ui.
    addItemToTheUI(item) {
      //show the list
      document.getElementById(UISelector.itemlist).style.display = "block";
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
        </a>`;
      document
        .getElementById(UISelector.itemlist)
        .insertAdjacentElement("beforeend", li);
    },
    //to clear input field after submitting item to the ui
    clearInput() {
      document.querySelector(UISelector.itemname).value = "";
      document.querySelector(UISelector.itemcalories).value = "";
    },
    //add item to the input field for editing
    addItemToTheInput() {
      const input = ItemCtrl.getCurrenItem();
      document.querySelector(UISelector.itemname).value = input.name;
      document.querySelector(UISelector.itemcalories).value = input.calories;
    },
    //to hide list when the list is empty
    hideList: function () {
      document.getElementById(UISelector.itemlist).style.display = "none";
    },
    //to add total calories to the ui after adding new item
    addTotalCaloriesToTheUI() {
      const cal = ItemCtrl.getTotalCalories();
      document.querySelector(UISelector.tCalories).textContent = cal;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelector.deletebtn).style.display = "none";
      document.querySelector(UISelector.updatebtn).style.display = "none";
      document.querySelector(UISelector.backbtn).style.display = "none";
      document.querySelector(UISelector.addbtn).style.display = "inline";
    },
    showUpdateBtn: function () {
      document.querySelector(UISelector.updatebtn).style.display = "inline";
    },
    showDeleteBtn: function () {
      document.querySelector(UISelector.deletebtn).style.display = "inline";
    },
    showBackBtn: function () {
      document.querySelector(UISelector.backbtn).style.display = "inline";
    },
    hideAddBtn: function () {
      document.querySelector(UISelector.addbtn).style.display = "none";
    },
    showEditState: function () {
      UICtrl.hideAddBtn();
      UICtrl.showDeleteBtn();
      UICtrl.showUpdateBtn();
      UICtrl.showBackBtn();
    },
    replacePrevious: function (item) {
      let list = document.querySelectorAll(UISelector.nodelist);
      //console.log(list)
      //convert nodelist into array
      list = Array.from(list);
      list.forEach(function (listItem) {
        const itemId = listItem.getAttribute("id");
        if (itemId === `item-${item.id}`) {
          document.querySelector(
            `#${itemId}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
      UICtrl.addTotalCaloriesToTheUI();
    },
    removeItem: function () {
      let list = document.querySelectorAll(UICtrl.getSelectors().nodelist);
      //console.log(list)
      //convert nodelist into array
      list = Array.from(list);
      list.forEach(function (listItem) {
        const itemId = listItem.getAttribute("id");
        if (itemId === `item-${ItemCtrl.getCurrenItem().id}`) {
          document.querySelector(`#${itemId}`).remove();
        }
      });
    },
    removeAllItems: function () {
      let list = document.querySelectorAll(UICtrl.getSelectors().nodelist);
      //console.log(list)
      //convert nodelist into array
      list = Array.from(list);
      list.forEach(function (listItem) {
        listItem.remove();
      });
    }
  };
})();

//App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  //load event listeners
  const loadEventListeners = function () {
    const UISelectors = UICtrl.getSelectors();
    //add item event
    document
      .querySelector(UISelectors.addbtn)
      .addEventListener("click", addItem);

    //disable submit on enter
    document.addEventListener("keypress", function (e) {
      if (e.key === 13) {
        e.preventDefault();
        return false;
      }
    });

    //edit item icon click event
    document
      .getElementById(UISelectors.itemlist)
      .addEventListener("click", editItem);

    //update item
    document
      .querySelector(UISelectors.updatebtn)
      .addEventListener("click", updateItem);

    //delete item
    document
      .querySelector(UISelectors.deletebtn)
      .addEventListener("click", deleteItem);
    //go back
    document.querySelector(UISelectors.backbtn).addEventListener('click', function(e) {
      UICtrl.clearEditState();
      e.preventDefault();
    })
    //clear all
    document.querySelector(UISelectors.clearbtn).addEventListener('click', clearAll);
  };
  //add item function
  const addItem = function (e) {
    const input = UICtrl.getItemInput();
    //add item to the dataset if inputs are not null.
    if (input.name !== "" && input.calories !== "") {
      //create new item
      const item = ItemCtrl.addItem(input.name, input.calories);
      //insert item to the ui
      UICtrl.addItemToTheUI(item);
      //add item to local storage
      StorageCtrl.storeItem(item);
      //clear input field
      UICtrl.clearInput();
      //add total calories
      UICtrl.addTotalCaloriesToTheUI();
    }
    e.preventDefault();
  };

  //edit item function
  const editItem = function (e) {
    if (e.target.classList.contains("edit-item")) {
      UICtrl.showEditState();
      //get list item id
      const listid = e.target.parentNode.parentNode.id;
      //console.log(listid)
      //split the number
      const arr = listid.split("-");
      //find item to edit
      const editTarget = ItemCtrl.itemToEdit(parseInt(arr[1]));
      //console.log(editTarget);
      //set currentItem
      ItemCtrl.setCurrenItem(editTarget);
      //set current item to the input field for edit
      UICtrl.addItemToTheInput();
    }
    e.preventDefault();
  };

  //update item function
  const updateItem = function (e) {
    const newItem = UICtrl.getItemInput();
    //console.log(newItem);
    //set update to the data
    const update = ItemCtrl.setItem(newItem);
    //show update to the ui and clear states
    UICtrl.replacePrevious(update);
    //update local storage
    StorageCtrl.updateStorageItem(update);
    UICtrl.clearEditState();
    e.preventDefault();
  };

  //delete item
  const deleteItem = function (e) {
    UICtrl.removeItem();
    ItemCtrl.removeItemFromData();
    UICtrl.addTotalCaloriesToTheUI();
    const itemToRemove = ItemCtrl.getCurrenItem();
    StorageCtrl.deleteStorageItem(itemToRemove);
    UICtrl.clearEditState();
    e.preventDefault();
  };

  //clear all items
  const clearAll = function (e) {
    ItemCtrl.clearAllItems();
    UICtrl.removeAllItems();
    UICtrl.addTotalCaloriesToTheUI();
    StorageCtrl.deleteAllStorageItem();
    UICtrl.hideList();
    e.preventDefault();
  }

  return {
    init: function () {
      //clear edit states
      UICtrl.clearEditState();
      //fetch items
      const items = ItemCtrl.getItems();

      //check if the item list is empty. if yes, then hide the list ui
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //populate item list in the ui
        UICtrl.populateItemList(items);
      }
      //show initial calories
      UICtrl.addTotalCaloriesToTheUI();
      //load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
