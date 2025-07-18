// <editor-fold defaultstate="collapsed" desc=" class : dates ">
/*
 * Use it like that:
 * let minD = _iGUdates.get_dateObj_formated(new Date("2023-10-08));
 * 
 * Use new Date("2023,10,08") -> date separated by [,] so the result will be the exact requested date and not adjusted to the TZ which may change the date
 * 
 */
class _iGU_dates{
    constructor(a){
        let defaults = {};
        this["a"] = $.extend(true, {}, defaults, a);
        
        this.events();
    }

    events(){}
    
    get_date_formated(a){
        let defaults = {
            "date": new Date(), 
            "fmt"    : "mm/dd/yyyy",
            "localStr" : {
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: undefined,
                hour12: true // This ensures AM/PM formatting
            }
        };
        a = $.extend(true, {}, defaults, a);
        
//        if(typeof a["date"] === "number"){
        if(! (a["date"] instanceof Date)){
            a["date"] = new Date(a["date"]); 
        }
        
        
        let yyyy = a["date"].getFullYear();
        let yy   = yyyy % 100;
        let m    = a["date"].getMonth()+1;
        let mm   = m < 10? "0"+m : m;
        let d    = a["date"].getDate();
        let dd   = d < 10? "0"+d : d;
        let h    = a["date"].getHours();
        let hh   = h < 10? "0"+h : h;
        let i    = a["date"].getMinutes();
        let ii   = i < 10? "0"+i : i;
        let s    = a["date"].getSeconds();
        let ss   = s < 10? "0"+s : s;
        
        
        let rtn = "";
        if(a["fmt"] === "mm/dd/yyyy"){
            rtn = `${mm}/${dd}/${yyyy}`;
        } else if(a["fmt"] === "yyyy,mm,dd"){
            rtn = `${yyyy},${mm},${dd}`;
        } else if(a["fmt"] === "yyyy-mm-dd"){
            rtn = `${yyyy}-${mm}-${dd}`;
        } else if(a["fmt"] === "yy-mm"){
            rtn = `${yy}-${mm}`;
        } else if(a["fmt"] === "yyyy-mm-dd_hh-mm-ss"){
            rtn = `${yyyy}-${mm}-${dd}_${hh}-${ii}-${ss}`;    
        } else if(a["fmt"] === "ISO"){
            // The result WILL take timezone in to account 
            rtn = a["date"].toISOString();  // use: .slice(0, 10); to get only the date. 
        } else if(a["fmt"] === "obj_all"){
            rtn = {"yyyy": yyyy, "yy": yy, "m": m, "mm": mm, "d": d, "dd": dd};
        } else if(a["fmt"] === "localStr"){
            rtn = a["date"].toLocaleString('en-US', a["localStr"]);
        }
        
        return rtn;        
    }
    
    getDate_from_date_and_numDays(a){
        let defaults = {
            "baseDate": new Date(), 
            "nrDays"  : 0     // days can be [30|-30]
        };
        a = $.extend(true, {}, defaults, a);
        
//        if(typeof a["baseDate"] === 'number'){
        if(! (a["date"] instanceof Date)){
            a["baseDate"] = new Date(a["baseDate"]); 
        }
        
        let rtn = a["baseDate"].setDate(a["baseDate"].getDate() + a["nrDays"]);
        return rtn;
    }
    
    
    dateDiff(date1=new Date(), date2=new Date(), a) {
        // if you do not want to send a value to date1 or date2 send undefined and it will get the value of new Date()
        // _iGUdates.dateDiff(undefined, next_renew_data);
        let defaults = {
            "replyIn" : "dd"   // will return the numbers of Days
        };
        a = $.extend(true, {}, defaults, a);
        
        let difference = null;
    
        // Parse the dates into Date objects
        if(! (date1 instanceof Date)){
            date1 = new Date(date1);
        }
        if(! (date2 instanceof Date)){
            date2 = new Date(date2);
        }

        // Calculate the difference in milliseconds and convert to days
        let differenceInTime = date2 - date1;
        if(a["replyIn"] === "dd"){
            difference = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24)); // Convert ms to days
        }

        return difference;
}
    
    
    
    /* datediff = function(first, second) {
        // Take the difference between the dates and divide by milliseconds per day.
        // Round to nearest whole number to deal with DST.
        return Math.round((second-first)/(1000*60*60*24));
    };  */
    
}
// </editor-fold>


function generate_selectDD_withUniqueList(data, { keyToMatch, CustomTabulator } = {}) {
    let uniqueDataCountOf_KeyToMatch = data.reduce((acc, obj) => {
        // increase the count by one for matched data
        acc[obj[keyToMatch]] = (acc[obj[keyToMatch]] || 0) + 1;
        return acc;
    }, {});

    // create list
    let uniqueSelectList_for_Dropdown = Object.entries(uniqueDataCountOf_KeyToMatch)
        .map(([keyToMatch, count]) => {
            return {
                field: keyToMatch,
                title: `${keyToMatch} (<span data-counter="${count}" class="selected">0</span>/${count})`,
                visible: true,
                dinm_dd_toCcheck: false,
            };
        })
        .sort((a, b) => a.field.localeCompare(b.field));

    // generate actual dropdown element
    const dropdown = iGet_el_SelectDropdown({
        el_w: { class: 'move_ddown_to_body' },
        calling_btn: {
            class: 'form-control form-control-sm border py-1',
            _style: 'border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;',
            icon: { class: 'fa-line-columns fa-filter' },
            alt_el: `<span class="pe-2">Select</span>`,
        },
        dd_element: { class: 'iTr_F_01' },
        dd_title: { text: `Select ${keyToMatch}s` },
        dd_filter: { input: { placeholder: `Search ${keyToMatch}...` } },
        dd_select_all: { class: 'd-none' },
        dd_select_list: { data: uniqueSelectList_for_Dropdown, exludeBy: 'src' },
        TabulatorObj: CustomTabulator.TabulatorObj,

        fn_onInptChkChange: (e, ops) => {
            const value_to_match = $(e.target).attr('value');

            let rows = CustomTabulator.TabulatorObj.getRows();
            if (CustomTabulator.TabulatorObj.getHeaderFilters().length > 0) {
                rows = CustomTabulator.filtered_tbl_data;
            }

            if ($(e.target).prop('checked')) {
                CustomTabulator.TabulatorObj.getRows('visible').forEach((row) => {
                    if (row.getData()[keyToMatch] == value_to_match) {
                        CustomTabulator.selectRowAndCheckInput(row);
                    }
                });
                rows.forEach((row) => {
                    if (row.getData()[keyToMatch] == value_to_match) {
                        CustomTabulator.selectRowAndCheckInput(row, false);
                    }
                });
                // updating the select rows count(in label) for the select checkebox
                const counter_el = $(e.target).closest('.form-check').find('.selected');
                counter_el.empty().text(counter_el.attr('data-counter'));
            } else {
                rows.forEach((row) => {
                    if (row.getData()[keyToMatch] == value_to_match) {
                        CustomTabulator.selectRowAndCheckInput(row, false, true);
                    }
                });
                // updating the select rows count(in label) for the select checkebox
                const counter_el = $(e.target).closest('.form-check').find('.selected');
                counter_el.empty().text('0');
            }
        },
        fn_onDropdown_shown: (e, ops) => {
            let data = CustomTabulator.TabulatorObj.getData().filter((row) => row.is_row_selected);
            if (CustomTabulator.TabulatorObj.getHeaderFilters().length > 0) {
                data = CustomTabulator.filtered_tbl_data.filter((row) => row.getData().is_row_selected).map((row) => row.getData());
            }

            let selected_counts = data.reduce((acc, obj) => {
                acc[obj[keyToMatch]] = (acc[obj[keyToMatch]] || 0) + 1;
                return acc;
            }, {});

            // setting selected text to 0 if none is selected in table
            const dropdown_id = $('button', dropdown).attr('id');
            const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
            $('input.form-check-input', drop_down).prop('checked', 0);
            $('.selected', drop_down).text('0');

            $.each(selected_counts, function (key, value) {
                let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr('id')}"]`).attr('id');
                $(`#${id}`).prop('checked', value > 0);
                $('.selected', `label[for="${id}"]`).text(value);
            });

            return true;
        },
    });

    return dropdown;
}

String.prototype.iString_replace_by_array = function(find, replace) {
    // <editor-fold defaultstate="collapsed" desc=" See here about ascaping characters ">
    /*
     * to Escape special characters in the array add \\ so [ is \\[
     * you may use this to see how the escape is working: "mystring".replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
     * 
var myArray = ['[', ']'];
var inputString = '[example]';

// Escape special characters in the array
var escapedArray = myArray.map(function(element) {
return element.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
});

// Create a regular expression using the escaped array
var regex = new RegExp(escapedArray.join('|'), 'g');

// Use the regular expression to replace characters in a string
var result = inputString.replace(regex, '');
     */
    // </editor-fold>
    var replaceString = this;
    var regex; 
    for (var i = 0; i < find.length; i++) {
    regex = new RegExp(find[i], "g");
      replaceString = replaceString.replace(regex, replace[i]);
    }

    return replaceString;
};    


$.fn.iToggle = function(a){
      let defaults = {
        "c" : true,
        "a" : "d-none", // if true : add [a] class, remove [r] class
        "r" : "",       // if false: remove [a] class, add [r] class
        "t_css" : {},
        "f_css" : {}
      };
      a = $.extend(true, {}, defaults, a);

      if(a["c"]){
          $(this).addClass(a["a"]).removeClass(a["r"]).css(a["t_css"]);
      } else {
          $(this).addClass(a["r"]).removeClass(a["a"]).css(a["f_css"]);
      }
    };