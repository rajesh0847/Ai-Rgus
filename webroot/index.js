var _userStr = 'dummy';
if (window.location.hostname === 'localhost') {
    // Itsik
    $('[data-test-el="1"]').remove();
    if (location.pathname.includes('index.php')) {
        $('i.fal').removeClass('fal').addClass('fas');
        $('i.fa-line-columns').removeClass('fa-line-columns').addClass('fa-columns');
    }
} else {
    $('[data-test-el="1"]').siblings('i').remove();
}

// <editor-fold defaultstate="collapsed" desc=" Document ready ">
//#region Document ready
$(document).ready(function () {
    $('.nav_expanded').click(function () {
        $('.main_content').toggleClass('expand-container');
        let leftNav_el = $(this).closest('.left-nav');
        let container_el = $(this).closest('.container-fluid');
        iConsole('inn');

        let leftNav_widths = [$('.container-fluid').css('--left_navExp-width'), $('.container-fluid').css('--left_nav-width')];

        // $(container_el).css('--left_nav_current-width', leftNav_widths[ +$(leftNav_el).hasClass('expanded') ]); // the + will force 0 or 1
        setTimeout(() => {
            $(leftNav_el).toggleClass('expanded');
        }, 1001);
    });
    $('.nav-link').click(function () {
        if ($(this).attr('href') == '#tab1' && !$(this).hasClass('ints')) {
            infinite_loading();
        }

        if ($(this).attr('href') == '#tab2' && !$(this).hasClass('ints')) {
            paginated_loading();
        }
        if ($(this).attr('href') == '#tab3' && !$(this).hasClass('ints')) {
            paginated_local_loading();
        }
        if ($(this).attr('href') == '#itsik-local' && !$(this).hasClass('ints')) {
            itsik_local();
        }
        if ($(this).attr('href') == '#itsik-local' && !$(this).hasClass('ints')) {
            group_table ();
        }
        if ($(this).attr('href') == '#autopay' && !$(this).hasClass('ints')) {
            autoTable();
        }
        if ($(this).attr('href') == '#dual-page' && !$(this).hasClass('ints')) {
            dualTable();
        }
        if ($(this).attr('href') == '#raw-table' && !$(this).hasClass('ints')) {
            dataTable();
        }
        if ($(this).attr('href') == '#multi-tbls' && !$(this).hasClass('ints')) {
            multi_tbl_1();
            multi_tbl_2();
        }

        if ($(this).attr('href') == '#J_input-tab' && !$(this).hasClass('ints')) {
            J_input();
        }

        if ($(this).attr('href') == '#JSettings_input-tab' && !$(this).hasClass('ints')) {
            JSON_Settings_input();
        }

        if ($(this).attr('href') == '#temp01-tab' && !$(this).hasClass('ints')) {
            getMuteData_to_iTr();
        }
        if ($(this).attr('href') == '#copy-paste-tab' && !$(this).hasClass('ints')) {
            copy_paste_local_loading();
        }
        if ($(this).attr('href') == '#tab4' && !$(this).hasClass('ints')) {
            clientDetails();
        }
        if ($(this).attr('href') == '#tab5' && !$(this).hasClass('ints')) {
            json_object_sort();
        }
        if ($(this).attr('href') == '#multiTab-local' && !$(this).hasClass('ints')) {
            multi_tab_table1();
            multi_tab_table2();
        }
        if ($(this).attr('href') == '#dropdown' && !$(this).hasClass('ints')) {
            exampleDropdown();
        }

        $(this).addClass('ints');
    });
    // $('.nav-link[href="#tab1"]')[0].click();
    // $('.nav-link[href="#copy-paste-tab"]')[0].click();
    $('.nav-link[href="#itsik-local"]')[0].click();
    // $('.nav-link[href="#dropdown"]')[0].click();

    // $('.nav-link[href="#autopay"]')[0].click();
    // $('.nav-link[href="#multiTab-local"]')[0].click();
    //    $('.nav-link[href="#multi-tbls"]')[0].click();
    // $('.nav-link[href="#J_input-tab"]')[0].click();
    //  $('.nav-link[href="#JSettings_input-tab"]')[0].click();
    // $('.nav-link[href="#temp01-tab"]')[0].click();
});
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" infinite loading table ">
//#region - infinite loading table
let infinite_loading = () => {
    const tableId = 'infinite-loading-table';
    const tableContainer = `.${tableId}-container`;

    // object containing the key as the column name of the table and value as the classname for the dropdown element to generate.
    // used inside the column config
    let header_filter_dropdown = {
        location: 'location_header_select',
        gender: 'gender_header_select',
    };

    const CustomTabulator = new FeaturedTable('infinite-loading', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,
        tbl_toolbar: {
            tmpl_name: 'editMultiP_sColVExp',
            axns: {
                edit_remove: ['.duplicate-row-btn', '.delete-row-btn'],
                el_w: '#TMPLs_iTr_health_sets',
                multi_select: { els: ['.health-set_Lmain-multi_select'] },
                multi_purps: { els: ['.health-set_Lmain_multiP'] },
            },
        },
        TabulatorInitOptions: {
            ajaxURL: 'php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php',
            paginationSize: 30,
            progressiveLoad: 'scroll',
            progressiveLoadScrollMargin: 200,
            layout: 'fitColumns',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            height: `${$('.table_w').height() - 250}px`, // we do not yet have the real table position or the table header element
            rowHeight: 40,

            // renderVertical: 'basic',

            iTr_on_one_row_selection: function () {
                iConsole('single row selected');
            },
            iTr_on_multiple_row_selection: function () {
                iConsole('multiple row selected');
            },
            iTr_on_zero_row_selection: function () {
                iConsole('zero row selected');
            },
            iTr_add_new_row_before: function (fieldData) {
                // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
                fieldData.name = 'New Data';
                return true;
            },
            iTr_add_new_row_after: function (fieldData) {},
            iTr_row_save_before: function (TabulatorObj, ...fieldData) {
                return true;
            },
            iTr_row_save_after: function (newData) {
                $.ajax({
                    method: 'POST',
                    url: 'php/update-user.php',
                    dataType: 'json',
                    headers: {
                        csrftoken: _userStr,
                    },
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(newData),
                }).done((res) => {
                    if (res.success == 1) {
                        CustomTabulator.updateRowStatus();
                    } else {
                        alert(res.data?.error || 'Something went wrong');
                    }
                });
            },

            iTr_ajaxResponse: function (url, params, response) {
                response['data'] = response['dtRows'];
                return response;
            },
            iTr_rowFormatter_before: function (row) {
                return true;
            },
            iTr_rowFormatter_after: function (row) {},

            iTr_rowDuplicate_start: function (newRowData, demoVar1, demoVar2) {
                newRowData.email = '';
                return true;
            },
            iTr_rowDuplicate_end: function () {},

            // layout: 'fitColumns',
            printHeader: function () {
                return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
            },
            printFooter: function () {
                const timeStamp = getCurrentTimestamp();

                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                    <div class="d-flex gap-2">
                        <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                        <span class='fs-6'>${timeStamp}</span>
                    </div>
                </div>`;
            },
            printFormatter: (tableHolder, table) => {
                $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                $(table).find('thead th').css({ 'font-size': '11px' });
                $(table).find('tbody td').css({ 'font-size': '12px' });
            },
            printRowRange: 'all',
            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region -columnsObj
            columnsObj: function () {
                return [
                    /*
                    {
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: '',
                        field: 'rowExpand',
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown       
                        expandToKeyData : "gender",
                        
                        formatter: function (cell, formatterParams, onRendered) {                            
                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered,expandRowWithNestedTable_Level1);
                            return el;
                        },   
                        increaseTblHeight: function(row){
                            $(CustomTabulator.TabulatorObj.element).attr('style', "height:1100px !important");
                        },
                        scrollRowTblAfterLoad: function(row){
                            // row.getElement().scrollIntoView({block:"end"});
                            CustomTabulator.TabulatorObj.scrollToRow(row, "top", false)

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                        }
                    },
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,
                    },
                    */
                    {
                        field: 'rowExpand',
                        expandTo: expandRowWithNestedTable_Level1,
                        // expandTblHeight_style : "height:1100px !important",
                        expandToKeyData: 'gender',
                    },
                    {
                        field: 'rowSelection',
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                    },
                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 250,
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        _iExcludeFromList: { src: 0 },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                const editor = $(`<div class="name_select"></div>`);
                                $(editor).addClass('d-flex');
                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);

                                const name_dropdown = iGet_el_SelectDropdown({
                                    calling_for: 'name_datalist',
                                    el_w: { class: 'move_ddown_to_body' },
                                    calling_btn: {
                                        class: 'form-control form-control-sm border py-1 bg-white',
                                        _style: 'border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;',
                                        icon: { class: 'fa-line-columns fa-filter' },
                                        alt_el: `<span class="pe-2">Select</span>`,
                                    },
                                    dd_element: { class: 'iTr_F_01' },
                                    dd_title: { text: 'Select name' },
                                    dd_filter: { input: { placeholder: 'Search name...' } },
                                    dd_select_all: { class: 'd-none' },
                                    dd_src_input_enter_add_value: true,
                                    dd_select_list: {
                                        data: [
                                            { dTxt: 'henry', dVal: 'henry' },
                                            { dTxt: 'jacob', dVal: 'jacob' },
                                            { dTxt: 'simon', dVal: 'simon' },
                                        ],
                                        dTxt: 'dTxt',
                                        dVal: 'dVal',
                                    },
                                    TabulatorObj: CustomTabulator.TabulatorObj,
                                    fn_onInptChkChange: (e, ops) => {
                                        $(input).prop('value', $(e.target).prop('value'));
                                        $(input).trigger('change');
                                    },
                                    fn_onDropdown_shown: (e, ops) => {
                                        return true;
                                    },
                                });

                                $(editor).append(input);
                                $(editor).append(name_dropdown);
                                return editor[0];
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        width: 150,
                        headerSort: false,
                        headerFilter: 'input',
                        editable: this.isFieldEditable,
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                        editable: this.isFieldEditable,
                        headerFilter: (cell, onRendered, success, cancel) => {
                            // we are getting the table data empty because data is not loaded.
                            // that is why its logic is added in tableBuilt event for the tabulator.
                            const div = $(`<div class='${header_filter_dropdown.location}'></div>`);
                            return div[0];
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        visible: isColumnVisible.call(this, 'gender'),
                        validator: 'required',
                        width: 120,
                        editable: this.isFieldEditable,
                        validator: 'required',

                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class='${header_filter_dropdown.gender}'></div>`);
                            return div[0];
                        },
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'gender-list');
                                $(input).prop('name', 'gender');
                                $(input).prop('id', 'gender');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: false,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                    },
                ];
            },
            //#endregion
            // </editor-fold>
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
            /* handlers: {
                pdf: function () {
                    const currentThis = this.TabulatorObj;
                    const { jsPDF } = window.jspdf;
                    const HiddenCols = getHiddenCols.call(currentThis);
                    const data = currentThis
                        .getData()
                        .map((row) => {
                            // delete rowSelection column
                            delete row.rowSelection;
                            Object.keys(row).forEach((key) => {
                                if (HiddenCols.includes(key)) {
                                    delete row[key];
                                }
                            });
                            if (row.gender) {
                                if (row.gender == 'male') {
                                    row.gender = `1`;
                                }
                                if (row.gender == 'female') {
                                    row.gender = `2`;
                                }
                            }
                            return row;
                        })
                        .map((row) => Object.values(row));

                    // Define columns
                    const columns = currentThis
                        .getColumns()
                        .map((column) => (column.isVisible() ? column.getDefinition() : null))
                        .filter((col) => col != null && col?.field != 'rowSelection');

                    // First pass: Create a temporary document to get the total page count
                    const tempDoc = new jsPDF();
                    tempDoc.autoTable({
                        head: [columns],
                        body: data,
                        startY: 14,
                    });
                    const totalPages = tempDoc.internal.getNumberOfPages();

                    // Second pass: Create the final document with footer
                    const finalDoc = new jsPDF();

                    const pageDimensions = finalDoc.internal.pageSize;
                    const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
                    const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();

                    finalDoc.autoTable({
                        head: [columns],
                        body: data,
                        styles: {
                            fontSize: 7,
                        },
                        startY: 14,
                        didDrawPage: async function (data) {
                            const { left: leftMargin, right: rightMargin } = data.settings.margin;
                            const timeStamp = getCurrentTimestamp();

                            // add header
                            finalDoc.setFontSize(10);
                            const headerText = 'User Report';
                            const headerWidth = finalDoc.getTextWidth(headerText);
                            finalDoc.text(headerText, pageWidth / 2 - headerWidth / 2, 8);

                            // left part of the footer
                            let x;
                            let y;
                            let bottomY = pageHeight - 10;

                            const textWidth = finalDoc.getTextWidth('Powered by');

                            finalDoc.text('Powered by', leftMargin, bottomY);
                            finalDoc.setTextColor(blueColor);

                            const linkWidth = finalDoc.textWithLink('Ai-RGUS.com', (x = leftMargin + textWidth + 1), bottomY, {
                                url: 'https://ai-rgus.com/home',
                            });
                            finalDoc.setDrawColor(blueColor);
                            finalDoc.setLineWidth(0.2);
                            finalDoc.line(x, (y = pageHeight - 9), x + linkWidth, y);

                            finalDoc.setTextColor('#000');
                            finalDoc.text(timeStamp, x + linkWidth + 2, bottomY);

                            // right part of footer
                            const pageNoWidth = finalDoc.getTextWidth('Page ' + data.pageNumber + ' of ' + totalPages);
                            finalDoc.text(
                                'Page ' + data.pageNumber + ' of ' + totalPages,
                                pageWidth - pageNoWidth - rightMargin,
                                pageHeight - 10
                            );
                        },
                    });

                    finalDoc.save('table.pdf');
                },
                excel: function () {
                    const currentThis = this;
                    currentThis.TabulatorObj.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait',
                    });
                },
                print: function () {
                    const currentThis = this;
                    currentThis.TabulatorObj.print(false, true, {});
                },
            }*/
        },
        //#endregion
        // </editor-fold>
    });

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        focusInputOnLoad(`#${tableId} div[tabulator-field='email'] .tabulator-header-filter input`);

        // logic for tooltip adding in column headers
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);

        // adding the dropdowns as table column names
        CustomTabulator.uniqueSelectDropdowns.headerFilters = {
            location: null, // later we will store the dropdown element reference
            gender: null,
        };

        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        /*
        // -- for header filter in table - Location dropdown --
        let uniqueLocationObj = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArr = Object.entries(uniqueLocationObj).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        }).sort((a, b) => a.field.localeCompare(b.field));
        
        const location_dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArr, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");
                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', location_dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
        });
        $($('.'+header_filter_dropdown.location, $(CustomTabulator.TabulatorObj.element.closest(tableContainer)))[0]).append(location_dropdown);

        // -- for header filter in table - gender dropdown --
        const gender_key = 'gender'
        let uniqueGenderObj = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj[gender_key]] = (acc[obj[gender_key]] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueGenderArr = Object.entries(uniqueGenderObj).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        }).sort((a, b) => a.field.localeCompare(b.field));
        
        const gender_dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select genders"},
            dd_filter:   { input: {placeholder: "Search gender..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArr, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const value = $(e.target).attr("value");
                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData()[gender_key] == value){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData()[gender_key] == value){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj[gender_key]] = (acc[obj[gender_key]] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', gender_dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
        });
        $($('.'+header_filter_dropdown.gender, $(CustomTabulator.TabulatorObj.element.closest(tableContainer)))[0]).append(gender_dropdown);
        */
        // </editor-fold>
    });
};
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" paginated remote loading table ">
//#region - paginated remote loading table
let paginated_loading = () => {
    const tableId = 'paginated-remote-table';
    const tableContainer = '.paginated-remote-table-container';

    const CustomTabulator = new FeaturedTable('paginated-remote', '#' + tableId, {
        tableContainer,
        tbl_toolbar: {
            tmpl_name: 'editMultiP_sColVExp',
            axns: {
                edit_remove: ['.duplicate-row-btn', '.delete-row-btn'],
                el_w: '#TMPLs_iTr_pwd_set',
                single_select: { els: ['.pwd-set_single_select'] },
                multi_select: { els: ['.pwd-set_multi_select'] },
                //   "multi_purps": {els: [".pwd-set_multiP"]}
            },
        },
        TabulatorInitOptions: {
            // ajaxURL: 'https://dev1a.ai-rgus.com/php/users.php',
            ajaxURL: 'php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php',
            pagination: true,
            paginationMode: 'remote',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            paginationSizeSelector: [25, 50, 100, 500, 1000, 2500, 5000, 10000, 25000],
            paginationCounter: 'rows',
            rowHeight: 40,

            iTr_ajaxResponse: function (url, params, response) {
                //    iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
                return true;
            },

            // layout: 'fitColumns',
            printHeader: function () {
                return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
            },
            printFooter: function () {
                const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');

                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                <div class="d-flex gap-2">
                    <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                    <span class='fs-6'>${timeStamp}</span>
                </div>
            </div>`;
            },
            printFormatter: (tableHolder, table) => {
                $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                $(table).find('thead th').css({ 'font-size': '11px' });
                $(table).find('tbody td').css({ 'font-size': '12px' });
            },
            printRowRange: 'all',
            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region -columnsObj
            columnsObj: function () {
                return [
                    {
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: '',
                        field: 'rowExpand',
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                        expandToKeyData: 'gender',

                        formatter: function (cell, formatterParams, onRendered) {
                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered, expandRowWithNestedTable_Level1);
                            return el;
                        },
                        increaseTblHeight: function (row) {
                            $(CustomTabulator.TabulatorObj.element).attr('style', 'height:1100px !important');
                        },
                        scrollRowTblAfterLoad: function (row) {
                            // row.getElement().scrollIntoView({block:"end"});
                            CustomTabulator.TabulatorObj.scrollToRow(row, 'top', false);

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                        },
                    },
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 80,
                        visible: this.DefaultHiddenColumns.includes('id')
                            ? false
                            : this.TableSettings.persist_column_visibility.enabled
                            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes('id')
                            : true,
                    },
                    {
                        title: 'Name',
                        field: 'name',
                        visible: this.DefaultHiddenColumns.includes('name')
                            ? false
                            : this.TableSettings.persist_column_visibility.enabled
                            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes('name')
                            : true,
                        width: 150,
                        editor: 'input',
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: this.DefaultHiddenColumns.includes('email')
                            ? false
                            : this.TableSettings.persist_column_visibility.enabled
                            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes('email')
                            : true,
                        // width: 170,
                        editor: 'input',
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: this.DefaultHiddenColumns.includes('phone_number')
                            ? false
                            : this.TableSettings.persist_column_visibility.enabled
                            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes('phone_number')
                            : true,
                        width: 150,
                        editor: 'input',
                        headerSort: false,
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: this.DefaultHiddenColumns.includes('location')
                            ? false
                            : this.TableSettings.persist_column_visibility.enabled
                            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes('location')
                            : true,
                        width: 130,
                        editor: 'input',
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        editor: 'list',
                        visible: this.DefaultHiddenColumns.includes('gender')
                            ? false
                            : this.TableSettings.persist_column_visibility.enabled
                            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes('gender')
                            : true,
                        editorParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                            multiselect: true,
                            itemFormatter: function (label, value, item, element) {
                                return '<strong>' + label + ' </strong><br/><div>' + item.value + '</div>';
                            },
                        },
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        editor: 'input',
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: this.DefaultHiddenColumns.includes('favourite')
                            ? false
                            : this.TableSettings.persist_column_visibility.enabled
                            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes('favourite')
                            : true,
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: false,
                        editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: this.DefaultHiddenColumns.includes('dob')
                            ? false
                            : this.TableSettings.persist_column_visibility.enabled
                            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes('dob')
                            : true,
                        formatter: function (cell, formatterParams, onRendered) {
                            return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        },
                    },
                ];
            },
            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -iTr_rowFormatter_ before|after
            iTr_rowFormatter_before: function (row) {
                //                iConsole("------------ Table obj's rowFormatter Before ------------  ");
                return true;
            },
            iTr_rowFormatter_after: function (row) {
                //                iConsole("------------ Table obj's rowFormatter After ------------  ");
            },
            //#region -exports
            // </editor-fold>
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
        },
        //#endregion
        // </editor-fold>
    });
    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);
    });
    window.remoteTable = CustomTabulator;

    $('[data-bs-toggle="tooltip"]').tooltip();
};
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" paginated-local loading table ">
//#region paginated-local loading table
let paginated_local_loading = () => {
    const tableId = 'paginated-local-table';
    const tableContainer = '.paginated-local-table-container';

    // object containing the key as the column name of the table and value as the classname for the dropdown element to generate.
    // used inside the column config
    let header_filter_dropdown = {
        location: 'location_header_select',
        gender: 'gender_header_select',
    };

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,

        tbl_toolbar: {
            tmpl_name: 'readEdit_sColVExp',
            axns: {
                edit_remove: ['.duplicate-row-btn', '.delete-row-btn'],
                el_w: '#TMPLs_iTr_health_sets',
                multi_select: { els: ['.health-set_Lmain-multi_select'] },
                multi_purps: { els: ['.health-set_Lmain_multiP'] },
            },
        },

        TabulatorInitOptions: {
            ajaxURL: 'php/iDBcode.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php',
            sortMode: 'local',
            filterMode: 'local',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            paginationSize: 1000,
            pagination: true,
            paginationMode: 'local',
            paginationInitialPage: 1,
            paginationCounter: 'rows',
            paginationSizeSelector: [25, 50, 100, 500, 1000, 2500, 5000, 10000, 25000],
            height: `${$('.table_w').height() - 250}px`, // we do not yet have the real table position or the table header element
            rowHeight: 40,
            iTr_on_one_row_selection: function () {
                iConsole('single row selected');
            },
            iTr_on_multiple_row_selection: function () {
                iConsole('multiple row selected');
            },
            iTr_on_zero_row_selection: function () {
                iConsole('zero row selected');
            },

            //  We do not use this option as it create other issue. We manage these thing ourself by creating custom checkbox and it's state
            //            selectableRows:true,
            //                rowHeader: {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
            //                    rowRange:"active" //only toggle the values of the active filtered rows
            //                }, hozAlign:"center", headerSort:false},

            // iTr_ajaxResponse: function (url, params, response) {
            //     //                iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
            //     return response['dtRows'];
            // },

            iTr_add_new_row_before: function (fieldData) {
                // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
                fieldData.chbox = 1;
                fieldData.chbox2 = 0;
                fieldData.name = 'New Data';
                return true;
            },
            iTr_add_new_row_after: function (fieldData) {},

            iTr_row_save_before: function (TabulatorObj, ...fieldData) {
                iConsole('------------ iTr_row_save_before --------------');
                iConsole({ fieldData }, TabulatorObj);
                return true;
            },

            iTr_row_save_after: function (newData) {
                $.ajax({
                    method: 'POST',
                    url: 'php/update-user.php',
                    dataType: 'json',
                    headers: {
                        csrftoken: _userStr,
                    },
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(newData),
                }).done((res) => {
                    if (res.success == 1) {
                        CustomTabulator.updateRowStatus();
                    } else {
                        alert(res.data?.error || 'Something went wrong');
                    }
                });
            },
            iTr_ajaxResponse: function (url, params, response) {
                response['data'] = response['dtRows'];
                return response;
            },
            iTr_rowFormatter_before: function (row) {
                return true;
            },
            iTr_rowFormatter_after: function (row) {},

            iTr_rowDuplicate_start: function (newRowData, demoVar1, demoVar2) {
                newRowData.email = '';
                return true;
            },
            iTr_rowDuplicate_end: function () {},

            printHeader: function () {
                return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
            },
            printFooter: function () {
                const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');

                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                <div class="d-flex gap-2">
                    <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                    <span class='fs-6'>${timeStamp}</span>
                </div>
            </div>`;
            },
            printFormatter: (tableHolder, table) => {
                $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                $(table).find('thead th').css({ 'font-size': '11px' });
                $(table).find('tbody td').css({ 'font-size': '12px' });
            },
            printRowRange: 'all',
            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region -columnsObj
            columnsObj: function () {
                return [
                    {
                        field: 'rowExpand',
                        expandTo: expandRowWithNestedTable_Level1,
                        // expandTblHeight_style : "height:1100px !important",
                        expandToKeyData: 'gender',
                    },
                    {
                        field: 'rowSelection',
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: { cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
                        //                        field_1: 'isCurrentRow',
                        //                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function () {
                                success($(this).val());
                            });

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 250,
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        iExcludeFromList: { src: 0 },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                const editor = $(`<div class="name_select"></div>`);
                                $(editor).addClass('d-flex');
                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);

                                const name_dropdown = iGet_el_SelectDropdown({
                                    calling_for: 'name_datalist',
                                    el_w: { class: 'move_ddown_to_body' },
                                    calling_btn: {
                                        class: 'form-control form-control-sm border py-1 bg-white',
                                        _style: 'border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;',
                                        icon: { class: 'fa-line-columns fa-filter' },
                                        alt_el: `<span class="pe-2">Select</span>`,
                                    },
                                    dd_element: { class: 'iTr_F_01' },
                                    dd_title: { text: 'Select name' },
                                    dd_filter: { input: { placeholder: 'Search name...' } },
                                    dd_select_all: { class: 'd-none' },
                                    dd_src_input_enter_add_value: true,
                                    dd_select_list: {
                                        data: [
                                            { dTxt: 'henry', dVal: 'henry' },
                                            { dTxt: 'jacob', dVal: 'jacob' },
                                            { dTxt: 'simon', dVal: 'simon' },
                                        ],
                                        dTxt: 'dTxt',
                                        dVal: 'dVal',
                                    },
                                    TabulatorObj: CustomTabulator.TabulatorObj,
                                    fn_onInptChkChange: (e, ops) => {
                                        $(input).prop('value', $(e.target).prop('value'));
                                        $(input).trigger('change');
                                    },
                                    fn_onDropdown_shown: (e, ops) => {
                                        return true;
                                    },
                                });

                                $(editor).append(input);
                                $(editor).append(name_dropdown);
                                return editor[0];
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,
                        //
                        cellMouseEnter: function (event, cell) {
                            CustomTabulator.iTr_zoom_or_edit({}, 'MouseEnter', event, cell);
                        },
                        //                         cellMouseLeave: function (event, cell) {
                        //                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
                        //                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit(
                                { popo_z: { class: 'mb-0 close_on_scroll', style: 'background-color: #e7e7e9;' } },
                                'DblClick',
                                event,
                                cell
                            );
                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        width: 150,
                        headerSort: false,
                        headerFilter: 'input',
                        editable: this.isFieldEditable,
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                        editable: this.isFieldEditable,
                        headerFilter: (cell, onRendered, success, cancel) => {
                            // we are getting the table data empty because data is not loaded.
                            // that is why its logic is added in tableBuilt event for the tabulator.
                            const div = $(`<div class='${header_filter_dropdown.location}'></div>`);
                            return div[0];
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        visible: isColumnVisible.call(this, 'gender'),
                        validator: 'required',
                        width: 120,
                        editable: this.isFieldEditable,
                        validator: 'required',

                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class='${header_filter_dropdown.gender}'></div>`);
                            return div[0];
                        },
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'gender-list');
                                $(input).prop('name', 'gender');
                                $(input).prop('id', 'gender');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: false,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 350,
                        print: false,
                        download: false,
                        headerSort: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                ];
            },
            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -iTr_rowFormatter_ before|after
            iTr_rowFormatter_before: function (row) {
                //                iConsole("------------ Table obj's rowFormatter Before ------------  ");

                var data = row.getData();
                //                if(data.isCurrentRow?.edit_mode || data.isCurrentRow?.edit_mode)
                $(row.getElement()).attr('data-location', data.location);

                if (data.location == 'India') {
                    row.getCell('location').getElement().style.color = 'blue';
                }
                if (data.location == 'China') {
                    $(row.getElement()).addClass('china');

                    // add custom html to the cell
                    row.getCell('location').getElement().innerHTML = `<a href='google.com'>${data.location}</a>`;
                }

                if (row.getData().isCurrentRow?.edit_mode) {
                    $(row.getElement()).removeClass('china');
                }

                return true;
            },
            iTr_rowFormatter_after: function (row) {
                //                iConsole("------------ Table obj's rowFormatter After ------------  ");
            },
            //#endregion
            // </editor-fold>
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
        },
        //#endregion
        // </editor-fold>
    });
    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        focusInputOnLoad(`#${tableId} div[tabulator-field='name'] .tabulator-header-filter input`);

        // logic for tooltip adding in column headers
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);

        // adding the dropdowns as table column names
        CustomTabulator.uniqueSelectDropdowns.headerFilters = {
            location: null, // later we will store the dropdown element reference
            gender: null,
        };

        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        /* 
        // -- for header filter in table - Location dropdown --        
        let uniqueLocationObj = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArr = Object.entries(uniqueLocationObj).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        }).sort((a, b) => a.field.localeCompare(b.field));
        
        const location_dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArr, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");
                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', location_dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
        });
        $($('.'+header_filter_dropdown.location, $(CustomTabulator.TabulatorObj.element.closest(tableContainer)))[0]).append(location_dropdown);

        // -- for header filter in table - gender dropdown --
        const gender_key = 'gender'
        let uniqueGenderObj = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj[gender_key]] = (acc[obj[gender_key]] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueGenderArr = Object.entries(uniqueGenderObj).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        }).sort((a, b) => a.field.localeCompare(b.field));
        
        const gender_dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select genders"},
            dd_filter:   { input: {placeholder: "Search gender..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArr, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const value = $(e.target).attr("value");
                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData()[gender_key] == value){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData()[gender_key] == value){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj[gender_key]] = (acc[obj[gender_key]] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', gender_dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
        });
        $($('.'+header_filter_dropdown.gender, $(CustomTabulator.TabulatorObj.element.closest(tableContainer)))[0]).append(gender_dropdown);
        */
        // </editor-fold>
    });
};
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fn: expandRowWithNestedTable_Level1 ">
//#region -fn: expandRowWithNestedTable_Level1
function expandPaginatedLocalRowWithNestedTable_Level1(e, row) {
    // increase the height of the table row is expanded
    const expand_row_def = row.getCell('rowExpand').getColumn().getDefinition();
    expand_row_def.increaseTblHeight?.(row);

    let btn = $(e.target).closest('button');
    $(btn).data('expanded', true).removeClass('btn-success').addClass('btn-danger');
    $('i', btn).removeClass('fa-plus').addClass('fa-minus');

    //    $(e.target).data('expanded', true);
    //    $(e.target).html('-');
    //    $(e.target).removeClass('bg-primary');
    //    $(e.target).addClass('bg-danger');

    // <button type="button" class="btnExpand btn btn-sm m-0 p-0 btn-danger"><i class="fas px-1 fa-minus"></i></button>
    // <button type="button" class="expand-btn btn btn-sm btn-success m-0 p-0"><i class="fas fa-plus px-1"></i></button>

    // <editor-fold defaultstate="collapsed" desc=" table's Data ">
    //#region -table's Data
    const tableId = row.getTable().element.id + `-nested-table-${row.getData().id}`;
    const tableContainer = `${tableId}-container`;

    // Add class to row element at the level
    $(row.getElement()).addClass('row-expanded-lvl-1');
    // <div class='${tableContainer} table-container p-2 itr-tbl-nested-1' style='width: ${$(row.getElement()).closest(".itsik-table-container").width()}px' >
    // console.log({styling: $(row.getElement()).width()}, $(row.getElement()).closest(".itsik-table-container").width())
    console.log({ width: 10 }, $(row.getElement()).closest('.tabulator-tableholder').width());
    $(row.getElement()).append(`
        <div class='${tableContainer} table-container p-2 itr-tbl-nested-1' style='width: ${
        $(row.getElement()).closest('.tabulator-tableholder').width() - 22
    }px' >
                <div class="table-header-toolbar_w px-2"></div>
                <div id="${tableId}" class="nested-table"></div>
            </div>`);

    // resize table width when it is resized
    iTr_listen_resize(row);

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer: '.' + tableContainer,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        tbl_toolbar: {
            tmpl_name: 'editMultiP_sColVExp',
            axns: {
                edit_remove: ['.duplicate-row-btn', '.delete-row-btn'],
                el_w: '#TMPLs_iTr_health_sets',
                multi_select: { els: ['.health-set_Lmain-multi_select'] },
                multi_purps: { els: ['.health-set_Lmain_multiP'] },
            },
        },
        TabulatorInitOptions: {
            ajaxURL: 'php/iDBcode.php',
            sortMode: 'local',
            filterMode: 'local',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },

            ajaxParams: function () {
                let params = {
                    recBY_fixedVal: row.getData()[expand_row_def['expandToKeyData']], // where fixedData = "female"  and defined once we expending a row from extandToDate
                };
                return params;
            },

            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region -columnsObj
            columnsObj: function () {
                // adding all other column configurations
                return [
                    {
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: '',
                        field: 'rowExpand',
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                        expandToKeyData: 'gender',

                        formatter: function (cell, formatterParams, onRendered) {
                            let el = CustomTabulator.cellF_rowExpand(
                                cell,
                                formatterParams,
                                onRendered,
                                expandRowWithNestedTable_Level2,
                                row
                            );
                            return el;
                        },
                        increaseTblHeight: function (row) {
                            $(CustomTabulator.TabulatorObj.element).attr('style', 'height:800px !important');
                        },
                        scrollRowTblAfterLoad: function (row) {
                            CustomTabulator.TabulatorObj.scrollToRow(row, 'top', false);
                            // row.getElement().scrollIntoView({block:"end"});

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                        },
                    },
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,

                        titleFormatterParams: {
                            rowRange: 'active', //only toggle the values of the active filtered rows
                        },
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: { cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
                        //                        field_1: 'isCurrentRow',
                        //                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function () {
                                success($(this).val());
                            });

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        iExcludeFromList: { src: 0 },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'browsers');
                                $(input).prop('name', 'browser');
                                $(input).prop('id', 'browser');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="browsers">
                                        <option value="Edge">
                                        <option value="Firefox">
                                        <option value="Chrome">
                                        <option value="Opera">
                                        <option value="Safari">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,
                        //
                        cellMouseEnter: function (event, cell) {
                            CustomTabulator.iTr_zoom_or_edit({}, 'MouseEnter', event, cell);
                        },
                        //                         cellMouseLeave: function (event, cell) {
                        //                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
                        //                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit(
                                { popo_z: { class: 'mb-0 close_on_scroll', style: 'background-color: #e7e7e9;' } },
                                'DblClick',
                                event,
                                cell
                            );
                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter: 'input',
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="location_header_select"></div>`);
                            return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="gender_header_select"></div>`);
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'gender-list');
                                $(input).prop('name', 'gender');
                                $(input).prop('id', 'gender');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 50,
                        print: false,
                        download: false,
                        headerSort: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                ];
            },
            //#endregion
            // </editor-fold>
        },
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
        },
    });

    CustomTabulator.TabulatorObj.on('dataLoading', () => {
        // scroll the row into view
        expand_row_def.scrollRowTblAfterLoad?.(row);
    });

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);

        // adding the dropdowns as table column names
        CustomTabulator.uniqueSelectDropdowns.headerFilters = {
            location: null, // later we will store the dropdown element reference
            gender: null,
        };

        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        /*
        // -- for header filter in table - Location dropdown --
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(dropdown);

        // --  for header filter in table - Gender dropdown --         
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(genderDropdown);
        */
        // </editor-fold>
    });
    //#endregion
    // </editor-fold>
}
//#endregion
// </editor-fold>

// sample formatter for chart data
function lineChartFormatter(cell, formatterParams, onRendered) {
    const filteredData = formatterParams.numberOfmonths ? chartData.slice(-formatterParams.numberOfmonths) : chartData;

    let tActivated = 1000;
    const activationData = filteredData.map((dt) => {
        tActivated = tActivated - dt.bd_qty_newaction;
        return tActivated;
    });

    const canvas = $('<canvas width="250" height="90">')[0];

    onRendered(function () {
        new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: filteredData.map((dt) => dt.bd_date),
                datasets: [
                    {
                        label: 'Service',
                        data: filteredData.map((dt) => dt.bd_qty_service),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    },
                    {
                        label: 'Activations',
                        data: activationData,
                        borderColor: 'rgba(192, 100, 75, 1)',
                        backgroundColor: 'rgba(192, 100, 75, 0.5)',
                    },
                ],
            },
            options: {
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                    x: { display: false },
                },
            },
        });
    });

    return canvas;
}

let group_table = () => {
    const tableData = [
        { id: 1, name: "Alice", progress: 80, gender: "female", rating: 4, col: "Red", dob: "1990-05-21", car: true },
        { id: 2, name: "Bob", progress: 55, gender: "male", rating: 3, col: "Blue", dob: "1988-11-14", car: false },
        { id: 3, name: "Clara", progress: 95, gender: "female", rating: 5, col: "Green", dob: "1992-09-30", car: true },
        { id: 4, name: "David", progress: 40, gender: "male", rating: 2, col: "Yellow", dob: "1985-04-10", car: false },
        { id: 5, name: "Eva", progress: 70, gender: "female", rating: 4, col: "Purple", dob: "1993-12-25", car: true },
        { id: 6, name: "Frank", progress: 60, gender: "male", rating: 3, col: "Orange", dob: "1991-06-18", car: true },
    ];

    var table = new Tabulator("#example-table", {
        height: "311px",
        layout: "fitColumns",
        movableRows: true,
        groupBy: "gender",
        data: tableData,
        groupHeader: function(value, count, data, group) {
            // Create a custom clickable group header
            let header = document.createElement("div");
            header.style.cursor = "pointer";
            header.style.fontWeight = "bold";
            header.innerHTML = `${value} (${count} item${count > 1 ? "s" : ""})`;

            // Toggle group on click anywhere on header
            header.addEventListener("click", () => {
                group.toggle(); // expand or collapse
            });

            return header;
        },
        columns: [
            { title: "Name", field: "name", width: 200 },
            { title: "Progress", field: "progress", formatter: "progress", sorter: "number" },
            { title: "Gender", field: "gender" },
            { title: "Rating", field: "rating", formatter: "star", hozAlign: "center", width: 100 },
            { title: "Favourite Color", field: "col" },
            { title: "Date Of Birth", field: "dob", hozAlign: "center", sorter: "date" },
            { title: "Driver", field: "car", hozAlign: "center", formatter: "tickCross" },
        ],
    });
}

// Call after DOM is ready
document.addEventListener("DOMContentLoaded", group_table);


// <editor-fold defaultstate="collapsed" desc=" Itsik table-local ">
//#region Itsik table-local
let itsik_local = () => {
    const tableId = 'itsik-table';
    const tableContainer = '.itsik-table-container';
    const pageId = 'itsik-local';

    const headerClick = (e, column) => {
        const table = column.getTable();
        const field = column.getField();
        const currentSort = table.getSorters();
        const excludedColumnField = table.options.groupBy;
        const newSort = currentSort.filter((sort) => !excludedColumnField.includes(sort.field));
        table.options.initialSort.forEach((sort) => {
            if (excludedColumnField.includes(sort.column.getField())) {
                newSort.unshift({ column: sort.column.getField(), dir: sort.dir })
            }
        })
        table.setSort(newSort);


        // currentSort.forEach((sort, index)=>{
        //     if (sort.field === excludedColumnField) {
        //         return;
        //     } else {
        //         newSort.push(sort);
        //     } 
        // })

        // let existing = currentSort.find(s => s.field === field);
        // let newDir = "asc";

        // if (existing) {
        //     newDir = existing.dir === "asc" ? "asc" : "desc";
        // }

        // table.setSort([
        //     {column: 'validDevice_gr', dir: 'desc'},
        //     {column: field, dir: newDir}
        // ]);        
    }

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,

        iTr_masterFilterClear_ops: {
            exceptions: [],
        },
        pageId,
        DefaultHiddenColumns: ['name'], // To activate this option
        //        fTbl_format : "TMPL_tbl_toolbars_f01",
        //        fTbl_controlers : {
        //            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tbl_multy_purps':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblColVisibility':{"c": "me-2"}},{'tblExport':{"c": "me-2"}},{'tblSettings':{"c": ""}}]
        //        },
        tbl_toolbar: {
            tmpl_name: 'readEdit_sColVExp',
            axns: {
                edit_remove: ['.duplicate-row-btn', '.delete-row-btn'],
                el_w: '#TMPLs_iTr_pwd_set',
                single_select: { els: ['.pwd-set_single_select'] },
                multi_select: { els: ['.pwd-set_multi_select'] },
                //   "multi_purps": {els: [".pwd-set_multiP"]}
            },
        },
        TabulatorInitOptions: {
            rowHeight: 100, // make rows taller
            virtualDomBuffer: 1600,
            no_record: 'test msg',
            tableStatusMessage:
                '<div">use vertical line at the right side of dropdown to resize the menu use vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menu<div>',
            initialSort: [
                { column: 'location', dir: 'asc' }, //sort by this first
                { column: 'name', dir: 'asc' }, //sort by this first
                { column: 'email', dir: 'asc' }, //sort by this first
            ],
            iTr_expand_multi_rows: true,
            iTr_showSortingBadgeNumber: true,
            iTr_multi_row_select_disable: true,
            iTr_run_before_creatingTr: () => {
                console.log('working');
            },

            ajaxURL: 'php/iDBcode.php',
            // groupBy:'location',
            // data: largeData,
            // ajaxURL: 'https://dev1a.ai-rgus.com/php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php',
            sortMode: 'local',
            filterMode: 'local',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            pagination: false,
            height: `${$('.table_w').height() - 189}px`, // we do not yet have the real table position or the table header element

            //  We do not use this option as it create other issue. We manage these thing ourself by creating custom checkbox and it's state
            //            selectableRows:true,
            //                rowHeader: {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
            //                    rowRange:"active" //only toggle the values of the active filtered rows
            //                }, hozAlign:"center", headerSort:false},

            iTr_ajaxResponse: function (url, params, response) {
                CustomTabulator.TabulatorObj.setGroupBy('location');
                // this.AdditionalTabulatorInitOptions.preProcessData(this, response);
                //                iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
                // response['dbRows'] = [...response['dbRows'], ...response['dbRows']];
                return response['dbRows'];
            },
            iTr_add_new_row_before: function (fieldData) {
                // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
                fieldData.chbox = 1;
                fieldData.chbox2 = 0;
                fieldData.name = 'New Data';
                return true;
            },
            iTr_row_save_after: function (newData) {
                // $.ajax({
                //     method: 'POST',
                //     url: 'php/update-user.php',
                //     dataType: 'json',
                //     headers: {
                //         csrftoken: _userStr,
                //     },
                //     contentType: 'application/json; charset=utf-8',
                //     data: JSON.stringify(newData),
                // }).done((res) => {
                //     if (res.success == 1) {
                //         CustomTabulator.updateRowStatus();
                //     } else {
                //         alert(res.data?.error || 'Something went wrong');
                //     }
                // });
                CustomTabulator.updateRowStatus();
            },

            printRowRange: 'all',

            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region columnsObj
            columnsObj: function () {
                return [
                    {
                        field: 'rowExpand',
                        expandTo: expandRowWithNestedTable_Level1,
                        // expandTblHeight_style : "height:800px !important",
                        expandToKeyData: 'gender',
                        formatterParams: {
                            onRowExpand: (e, row) => {
                                console.log('opened', e, row);
                            },
                            onRowCollapse: (e, row) => {
                                console.log('closed', e, row);
                            },
                        },
                    },
                    {
                        field: 'rowSelection',
                    },
                    {
                        title: 'id',
                        field: 'id',
                        visible: true,
                        hozAlign: 'right',
                        width: 123,
                        minWidth: 40,
                        headerWordWrap: false,
                        headerFilter: 'input',
                        formatterParams: {},
                        resizable: true,
                        sorter: 'number',
                        headerSort: true,
                        iTr_exp_attr: {
                            exp_data_enums: {
                                '': '-',
                            },
                            EXCEL: {
                                formula: (row)=>{
                                    return `D${row}+5`
                                },
                                style: {
                                    ws_cells: (cell)=>{
                                        return {alignment: {
                                            horizontal: 'right',
                                        }};
                                    },
                                },
                            },
                        },
                        tooltip: function (e, cell, onRendered) {
                            //e - mouseover event
                            //cell - cell component
                            //onRendered - onRendered callback registration function

                            var el = document.createElement('div');
                            el.style.backgroundColor = 'red';
                            el.innerText = cell.getColumn().getField() + ' - ' + cell.getValue(); //return cells "field - value";

                            return el;
                        },
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        hozAlign: 'center',
                        ...this.select_cell_FormatEditExport_manager({
                            dropdownOptions: {
                                // none : {v: "", t: "-", r_v: null},  // v is the elementvalue,r_v is the value to return once selected
                                none: { v: '', t: '-' }, // v is the elementvalue   if it is == "exclude-me" then we will exlude this option
                                opt1: { v: true, t: 'Yes' },
                                opt2: { v: false, t: 'No' },
                            },
                            exp_data_enums: { 0: 'No', 1: 'Yes' },
                        }),
                        formatter: undefined,
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,

                        hozAlign: 'center',
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Name',
                        field: 'name',
                        minWidth: 200,
                        headerFilter: true,
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        sorter: function (a, b, aRow, bRow, column) {
                            return a.localeCompare(b);
                        },
                        formatter: this.iTr_cell_editor_formatterEl,
                        formatterParams: {
                            iTr_dropdown: true,
                            label: 'text',
                            value: null, // value: null b/c value is the same as the text
                            iTr_dropdown_ops: {
                                iTr_add_tableOptions: {
                                    groupBy: 'accTypeGr',
                                    groupHeader: function (value, count, data, group) {
                                        return `${data[0].groupName}<div class="text-primary d-inline ms-2">(${count} item)</div>`;
                                    },
                                },
                            },
                            iDropdown_getlist: () => {
                                return dd_group_data;
                            },
                        },
                        iTr_exp_attr: {
                            EXCEL: {
                                style: {
                                    ws_cells: {
                                        alignment: { horizontal: 'left', wrapText: true },
                                    },
                                },
                            },
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,
                        formatterParams: {
                            iTr_dropdown: true,
                            iDropdown_select_after: async function (cell, listItem, dd_row, dropdown) {
                                console.log('first', listItem);
                            },
                        },
                        iTr_headerFilter_by_ddFilter: {
                            type: 'multi-checkbox',
                        },
                        cellMouseEnter: function (event, cell) {
                            CustomTabulator.iTr_zoom_or_edit({}, 'MouseEnter', event, cell);
                        },
                        //                         cellMouseLeave: function (event, cell) {
                        //                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
                        //                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit(
                                { popo_z: { class: 'mb-0 close_on_scroll', style: 'background-color: #e7e7e9;' } },
                                'DblClick',
                                event,
                                cell
                            );
                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter: 'input',
                        width: 250,
                        // iTr_headerFilter_by_ddFilter: {type: 'button'},
                        // editor: 'input',
                        // formatter: () => {
                        //     const $el_w = $(`<div class='d-flex'></div>`);
                        //     $el_w.append($(`<button id="popoverButton">b1</button>`));
                        //     const $dd = $(`<div class="dropdown dropdown-hover bg-danger"></div>`);
                        //     const $ddtoggle = $(`<button class="btn dropdown-toggle text-white border-0" type="button" id="dropdownMenuButton3" data-bs-toggle="dropdown" aria-expanded="false" data-bs-offset="100,-20" >b2</button>`)
                        //     const $list = $(`<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton3"><li><a class="dropdown-item" href="#">Action</a></li><li><a class="dropdown-item" href="#">Another action</a></li><li><a class="dropdown-item" href="#">Something else here</a></li></ul>`);
                        //     $dd.append($ddtoggle);
                        //     $dd.append($list)

                        //     $dd.on('show.bs.dropdown',function () {
                        //         $('ul.dropdown-menu', $dd).addClass('moved_ddown_to_body').appendTo('body');
                        //     });

                        //     $dd.hover(function() {
                        //         //$dd.dropdown('show');
                        //         $dd.click();
                        //     });

                        //     // $ddtoggle.mouseenter(function () {
                        //     //     // Stop the dropdown from closing when hovering over the menu items
                        //     //     $dd.addClass('show'); // Bootstrap's 'show' class ensures the dropdown remains visible
                        //     // }).mouseleave(function () {
                        //     //     // Hide the dropdown when the mouse leaves the menu
                        //     //     $dd.removeClass('show');
                        //     //     $dd.dropdown('hide');
                        //     // });
                        //     $el_w.append($dd);
                        //     $el_w.append($(`<button>b3</button>`));
                        //     return $el_w[0]
                        // },
                        formatter: function (cell, formatterParams, onRendered) {
                            const uniqueId = `popoverButton_${cell.getRow().getIndex()}`; // Create unique ID for each cell's button
                            const uniqueClass = `custompopoverdropdown_${cell.getRow().getIndex()}`;
                            const $el_w = $(`<div class='d-flex'></div>`);
                            $el_w.append($(`<button>b1</button>`));
                            $el_w.append($(`<button class='custom_popover' id="${uniqueId}">b2</button>`)); // Use dynamic unique ID
                            $el_w.append($(`<button>b3</button>`));

                            // Popover content
                            const popoverContent = `
                            <div class="dropdown">
                              <ul class="dropdown-menu show" aria-labelledby="dropdownMenuButton">
                                <li><a class="dropdown-item" href="#">Action</a></li>
                                <li><a class="dropdown-item" href="#">Another action</a></li>
                                <li><a class="dropdown-item" href="#">Something else</a></li>
                              </ul>
                            </div>
                            `;

                            // Initialize popover only after the button has been rendered
                            onRendered(() => {
                                new bootstrap.Popover(`#${uniqueId}`, {
                                    html: true,
                                    content: popoverContent,
                                    trigger: 'manual',
                                    placement: 'right',
                                    sanitize: false,
                                    offset: [50, 40],
                                    customClass: `${uniqueClass} custompopoverdropdown`,
                                });
                            });

                            // Return the formatted HTML for Tabulator cell
                            return $el_w[0];
                        },

                        formatterParams: {
                            numberOfmonths: 5,
                        },
                        headerSort: true,
                        editable: false,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: false,
                        width: 130,
                        headerFilter: (cell, onRendered, success, cancel) => {
                            // onRendered()
                            // success()
                            // we are getting the table data empty because data is not loaded.
                            // that is why its logic is added in tableBuilt event for the tabulator.
                            const div = $(`<div class="location_header_select"></div>`);
                            return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="gender_header_select"></div>`);
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'gender-list');
                                $(input).prop('name', 'gender');
                                $(input).prop('id', 'gender');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                        // iTr_pdf_export_col_styles:{
                        //     cellWidth: 60
                        // },
                        iTr_pdf_accessorDownload: function (data) {
                            if (data.gender == 'male') {
                                data.gender = '1';
                            } else {
                                data.gender = '0';
                            }
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        // headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        // formatter: this.iTr_cell_date_editor_formatterEl,

                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                        ...this.iTr_cell_date_wrapper('date'),
                        // ...this.iTr_cell_date_wrapper('time'),
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        iTr_exp_attr: { EXCEL: { style: { wch: 20, alignment: { horizontal: 'right' } } } },
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 350,
                        print: false,
                        download: false,
                        headerSort: false,
                    },
                ];
            },
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Print'],
            // do_not_export_fields:["rowExpand", 'name',"__dummy__", "__dummy_front__"],
            isOEM: 10,
            sort: { name: 1, email: -1 },
            pdf: {
                fileName: 'test222',
                // exp_pdf_styles: (data, column, value, doc) => {
                //     if (data.section === 'head') {
                //         data.cell.styles.fillColor = '#0d6efd';
                //     }
                // }
                // #0d6efd
            },
            excel: {
                // customRow: {
                //     position: 'afterHeader',
                //     value: [
                //     [
                //         { data: '1.🔥 Inserted Row', style: { font: { bold: true, color: { rgb: 'FF0000' } }, alignment: { horizontal: 'center' } } },
                //         { data: '1.Second Cell', style: { font: { italic: true }, fill: { fgColor: { rgb: 'FFFF00' } } } },
                //         { data: '1.Third', style: { font: { underline: true }, alignment: { horizontal: 'right' } } }
                //     ],
                //     [
                //         { data: '2.🔥 Inserted Row', style: { font: { bold: true, color: { rgb: 'FF0000' } }, alignment: { horizontal: 'center' } } },
                //         { data: '2.Second Cell', style: { font: { italic: true }, fill: { fgColor: { rgb: 'FFFF00' } } } },
                //         { data: '2.Third', style: { font: { underline: true }, alignment: { horizontal: 'right' } } }
                //     ]
                // ]
                // },
                fileName: 'test',
                whorkSheetName: 'sheet22',
                headerTextAlign: 'right',
                rowTextAlign: 'left',
            },
            print: {
                // fileName: 'test',
                // printHeader: function () {
                //     return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
                // },
                // printFormatter: (tableHolder, table) => {
                //     $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                //     $(table).find('thead th').css({ 'font-size': '11px' });
                //     $(table).find('tbody td').css({ 'font-size': '12px' });
                // },
                // printFooter: function () {
                //     // Part of Print, will be the last printed line at the last page.
                //     const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');
                //     return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                //         <div class="d-flex gap-2">
                //             <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                //             <span class='fs-6'>${timeStamp} ****</span>
                //         </div>
                //     </div>`;
                // },
            },
            handlers: {
                /* pdf: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    const { jsPDF } = window.jspdf;
                    const HiddenCols = getHiddenCols.call(currentThis);
                    const colsToExclude = ["rowSelection", "__dummy__", "ips", "fPerm", "rpar"];

                    const data = currentThis                    
                        .getData()
                        .map((row) => {
                            // delete rowSelection column
//                            delete row.rowSelection;
                            colsToExclude.reduce((obj, key) => (delete obj[key], obj), row);
                            Object.keys(row).forEach((key) => {
                                if (HiddenCols.includes(key)) {
                                    delete row[key];
                                }
                            });
                            if (row.gender) {
                                if (row.gender == 'male') {
                                    row.gender = `1`;
                                }
                                if (row.gender == 'female') {
                                    row.gender = `2`;
                                }
                            }
                            return row;
                        })
                        .map((row) => Object.values(row));

                    // Define columns             
                    const columnStyles = {};
                    let ii = 0;
                    const columns = currentThis
                        .getColumns()
                        .map((col) => {
                            if (col.isVisible() && !colsToExclude.includes(col.getField())){
                                columnStyles[ii++] = { cellWidth: col.getDefinition().width > 15? 15 : col.getDefinition().width };     // set colum's width
                                return col.getDefinition();
                            } else {
                                return null;
                            }
                        }
                    );
//                        .filter((col) => col != null && col?.field != 'rowSelection');

                    let pOpts = { orientation: 'landscape', unit: 'mm', format: 'Letter'};
                    // First pass: Create a temporary document to get the total page count
                    const tempDoc = new jsPDF(pOpts);
                    tempDoc.autoTable({
                        head: [columns],
                        body: data,
                        startY: 0,
                    });
                    const totalPages = tempDoc.internal.getNumberOfPages();

                    // Second pass: Create the final document with footer
                    const finalDoc = new jsPDF(pOpts);

                    const pageDimensions = finalDoc.internal.pageSize;
                    const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
                    const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();

                    finalDoc.autoTable({
                        head: [columns],
                        body: data,
                        columnStyles: columnStyles,
                        styles: { fontSize: 7 },
                        startY: 14,
//                        didDrawPage: async function (data) {
                        didDrawPage: function (data) {
                            const { left: leftMargin, right: rightMargin } = data.settings.margin;
                            const timeStamp = getCurrentTimestamp();

                            // add header
                            finalDoc.setFontSize(10);
                            const headerText = 'Clients Report';
                            const headerWidth = finalDoc.getTextWidth(headerText);
                            finalDoc.text(headerText, pageWidth / 2 - headerWidth / 2, 8);

                            // left part of the footer
                            let x;
                            let y;
                            let bottomY = pageHeight - 10;

                            const textWidth = finalDoc.getTextWidth('Powered by');

                            finalDoc.text('Powered by', leftMargin, bottomY);
                            finalDoc.setTextColor(blueColor);

                            const linkWidth = finalDoc.textWithLink('Ai-RGUS.com', (x = leftMargin + textWidth + 1), bottomY, {
                                url: 'https://ai-rgus.com/home',
                            });
                            finalDoc.setDrawColor(blueColor);
                            finalDoc.setLineWidth(0.2);
                            finalDoc.line(x, (y = pageHeight - 9), x + linkWidth, y);

                            finalDoc.setTextColor('#000');
                            finalDoc.text(timeStamp, x + linkWidth + 2, bottomY);

                            // right part of footer
                            const pageNoWidth = finalDoc.getTextWidth('Page ' + data.pageNumber + ' of ' + totalPages);
                            finalDoc.text(
                                'Page ' + data.pageNumber + ' of ' + totalPages,
                                pageWidth - pageNoWidth - rightMargin,
                                pageHeight - 10
                            );
                        },
                    }); 

                    finalDoc.save('clients.pdf');
                }, */
                excel: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait',
                    });
                },
                print: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.print(false, true, {});
                },
            },
        },
        //#endregion
        // </editor-fold>
    });

    // $(document).ready(function() {

    //     // Function to handle hiding the popover
    //     function handleHidePopover(uniqueId, uniqueClass) {
    //        setTimeout(() => {
    //             try {
    //                 const isHoveringButton = $(`#${uniqueId}`)[0]?.matches(':hover');
    //                 const isHoveringPopover = $(`.${uniqueClass}`)[0]?.matches(':hover');
    //                 // Only hide the popover if neither the button nor the popover is being hovered
    //                 if (!isHoveringButton && !isHoveringPopover) {
    //                     $(`#${uniqueId}`).popover('hide');
    //                 }
    //             } catch (error) {
    //                 console.log('errr', error)
    //             }
    //         }, 150); // Small delay to allow hover transitions
    //     }

    //     // Event listener for all popover buttons
    //     $(document).on('mouseenter', '[id^=popoverButton_]', function() {
    //         const uniqueId = $(this).attr('id');
    //         const uniqueClass = `custompopoverdropdown_${uniqueId.split('_')[1]}`;

    //         $(`#${uniqueId}`).popover('show');

    //         // Attach hover/click listeners after rendering popover
    //         setTimeout(() => {
    //             const $popover = $(`.${uniqueClass}`);

    //             // Hide popover when mouse leaves the popover area
    //             $popover.on('mouseleave', function () {
    //                 handleHidePopover(uniqueId, uniqueClass);
    //             });

    //             // Close on dropdown item click
    //             $popover.find('.dropdown-item').on('click', function () {
    //                 $(`#${uniqueId}`).popover('hide');
    //             });
    //         }, 100);
    //     });

    //     // Hide popover when mouse leaves the button
    //     $(document).on('mouseleave', '[id^=popoverButton_]', function() {
    //         const uniqueId = $(this).attr('id');
    //         const uniqueClass = `custompopoverdropdown_${uniqueId.split('_')[1]}`;
    //         handleHidePopover(uniqueId, uniqueClass);
    //     });
    // });

    // $(document).ready(function() {
    //     let hoverTimeout;
    //     let isMouseMovingTowardPopover = false;

    //     // Event listener for all popover buttons
    //     $(document).on('mouseenter', '[id^=popoverButton_]', function() {
    //         const uniqueId = $(this).attr('id');
    //         const uniqueClass = `custompopoverdropdown_${uniqueId.split('_')[1]}`;

    //         // Show the popover when mouse enters the button
    //         $(`#${uniqueId}`).popover('show');

    //         // Add mousemove listener to check if the mouse is moving toward the popover
    //         $(document).on('mousemove', function(event) {
    //             const button = $(`#${uniqueId}`);
    //             const popover = $(`.${uniqueClass}`);

    //             const isMouseOverButton = isMouseInsideElement(button, event);
    //             const isMouseOverPopover = isMouseInsideElement(popover, event);

    //             const buttonOffset = button.offset();
    //             const popoverOffset = popover.offset();

    //             const buttonRightEdge = buttonOffset.left + button.outerWidth();
    //             const popoverLeftEdge = popoverOffset.left;

    //             // Check if the mouse is between the button and the popover horizontally
    //             const isMouseBetweenButtonAndPopover = event.pageX >= buttonRightEdge && event.pageX <= popoverLeftEdge;

    //             // Check if the mouse is still over the button
    //             if (isMouseOverButton) {
    //                 isMouseMovingTowardPopover = true; // Mouse is over the button
    //             }

    //             // If mouse is over the popover after leaving the button and within the range between button and popover
    //             if (isMouseMovingTowardPopover && isMouseBetweenButtonAndPopover) {
    //                 clearTimeout(hoverTimeout); // Clear any previous timeout
    //                 $(`#${uniqueId}`).popover('show'); // Keep popover open

    //                 // Set a timeout to automatically close the popover after 150ms
    //                 hoverTimeout = setTimeout(() => {
    //                     $(`#${uniqueId}`).popover('hide');
    //                 }, 150);

    //                 isMouseMovingTowardPopover = false; // Reset after moving toward the popover
    //             }

    //             // If the mouse leaves both button and popover, hide the popover
    //             if (!isMouseOverButton && !isMouseOverPopover) {
    //                 clearTimeout(hoverTimeout); // Clear the timeout if mouse leaves both
    //                 $(`#${uniqueId}`).popover('hide');
    //                 isMouseMovingTowardPopover = false; // Reset
    //             }
    //         });
    //     });

    //     // Function to check if mouse is inside a given element
    //     function isMouseInsideElement($element, event) {
    //         const offset = $element.offset();
    //         const width = $element.outerWidth();
    //         const height = $element.outerHeight();

    //         return (
    //             event.pageX >= offset.left &&  // Check if the mouse X is inside the left/right boundaries
    //             event.pageX <= offset.left + width &&  // Check if the mouse X is inside the left/right boundaries
    //             event.pageY >= offset.top &&  // Check if the mouse Y is inside the top/bottom boundaries
    //             event.pageY <= offset.top + height  // Check if the mouse Y is inside the top/bottom boundaries
    //         );
    //     }
    // });

    CustomTabulator.TabulatorObj.on('rowClick', function (e, row) {
    const clickedRowEl = row.getElement();

    // If the clicked row is already selected, remove the class
    if (clickedRowEl.classList.contains('tabulator-selected')) {
        clickedRowEl.classList.remove('tabulator-selected');
    } else {
        // Remove 'tabulator-selected' from all other rows
        CustomTabulator.TabulatorObj.getRows().forEach(r => {
            r.getElement().classList.remove('tabulator-selected');
        });

        // Add class to the clicked row
        clickedRowEl.classList.add('tabulator-selected');
    }
});

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // CustomTabulator.TabulatorObj.setGroupBy('location');
        const sidebar = $('.letter-sidebar').empty();
        const allRows = CustomTabulator.TabulatorObj.getRows();
        let prefix = '';
        const resetBtn = $('<i class="reset_letters fal fa-redo fa-flip-horizontal ps-2" style="cursor:pointer;" title="Reset"></i>');
        sidebar.append(resetBtn);

        // Preprocess names: remove spaces, lowercase
        const names = allRows.map((row) => row.getData().name.toLowerCase().replace(/\s+/g, ''));

        // Create buttons A-Z once
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);
            const button = $("<button class='sidebar_index_letter text-center'></button>").text(letter);
            sidebar.append(button);
        }
        sidebar.append(resetBtn.clone());

        $('.reset_letters')
            .off('click')
            .on('click', () => {
                prefix = '';
                updateButtons();
            });

        const buttons = sidebar.find('button.sidebar_index_letter');

        // Update button enabled/disabled state
        function updateButtons() {
            buttons.each(function () {
                const letter = $(this).text().toLowerCase();
                const search = prefix + letter;
                const hasMatch = names.some((name) => name.startsWith(search));
                // $(this).prop('disabled', !hasMatch);
                $(this).iToggle({c: !hasMatch});
            });
        }

         // Button click handler
        buttons.off('click').on('click', function () {
            $(".reset_letters").removeClass("text-secondary cursor-auto opacity-50").addClass("cursor-pointer text-orange");            
            const letter = $(this).text().toLowerCase();
            let p_t = $(this).position().top + 10;
            
            prefix += letter;
            updateButtons();
            
            const sidebarHeight = $(".letter-sidebar").outerHeight(true);
            const windowHeight = $(window).height();
            if(sidebarHeight + p_t > windowHeight){
                p_t = windowHeight - sidebarHeight;
            }
            // $(".letter-sidebar").css({"margin-top": p_t});
            

            // Scroll to first matching row
            const idx = names.findIndex((name) => name.startsWith(prefix));
            if (idx !== -1) {
                allRows[idx].scrollTo();
            }
            
            setTimeout(()=>{
                $('.reset_letters').click();
            },10000);
        });
        
        $('.reset_letters').off('click').on('click', ()=>{
            prefix = '';
            $(".reset_letters").toggleClass("text-secondary cursor-auto opacity-50 cursor-pointer text-orange");
            updateButtons();
            
            $(".letter-sidebar").css({"margin-top": 0});                                    
        });

        // Initialize buttons
        updateButtons();
    });
    

    CustomTabulator.TabulatorObj.on('rowClick', function (e, row) {
        this.getRows().forEach((r) => r.getElement().classList.remove('highlighted'));
        row.getElement().classList.add('highlighted');
    });

    window.iTr_irLocal = CustomTabulator; // +info+ adding to global object to access it from developer tools and anywhere else in the code for debugging
};
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fn: expandRowWithNestedTable_Level1 ">
//#region -fn: expandRowWithNestedTable_Level1
function expandRowWithNestedTable_Level1(e, row) {
    // increase the height of the table row is expanded
    const expand_row_def = row.getCell('rowExpand').getColumn().getDefinition();
    // expand_row_def.increaseTblHeight?.(row);

    let btn = $(e.target).closest('button');
    $(btn).data('expanded', true).removeClass('btn-success').addClass('btn-danger');
    $('i', btn).removeClass('fa-plus').addClass('fa-minus');

    //    $(e.target).data('expanded', true);
    //    $(e.target).html('-');
    //    $(e.target).removeClass('bg-primary');
    //    $(e.target).addClass('bg-danger');

    // <button type="button" class="btnExpand btn btn-sm m-0 p-0 btn-danger"><i class="fas px-1 fa-minus"></i></button>
    // <button type="button" class="expand-btn btn btn-sm btn-success m-0 p-0"><i class="fas fa-plus px-1"></i></button>

    // <editor-fold defaultstate="collapsed" desc=" table's Data ">
    //#region -table's Data
    const tableId = row.getTable().element.id + `-nested-table-${row.getData().id}`;
    const tableContainer = `${tableId}-container`;

    row.getTable().CustomTabulator.iTr_expTbl_fn_expandToEl(1, row, tableId, null, true);

    // Add class to row element at the level
    // $(row.getElement()).addClass('row-expanded-lvl-1');
    // <div class='${tableContainer} table-container p-2 itr-tbl-nested-1' style='width: ${$(row.getElement()).closest(".itsik-table-container").width()}px' >
    // console.log({styling: $(row.getElement()).width()}, $(row.getElement()).closest(".itsik-table-container").width())
    console.log({ width: 10 }, $(row.getElement()).closest('.tabulator-tableholder').width());
    // const tableHolder = $(row.getElement()).closest('.tabulator-tableholder');
    // const hasScroll = tableHolder[0].scrollHeight >= tableHolder[0].clientHeight;
    // $(row.getElement()).append(`
    //     <div class='${tableContainer} table-container p-2 itr-tbl-nested-1' style='width: ${
    //     hasScroll ? tableHolder.width() - getScrollbarWidth() : tableHolder.width()
    // }px' >
    //             <div class="table-header-toolbar_w px-2"></div>
    //             <div id="${tableId}" class="nested-table"></div>
    //         </div>`);

    // resize table width when it is resized
    // iTr_listen_resize(row);

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer: '.' + tableContainer,
        iTr_expTbl: true,
        iTr_expTbl_MinHeight: 1000,
        iTr_expTbl_parentTbl: row.getTable().CustomTabulator,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        tbl_toolbar: {
            tmpl_name: 'editMultiP_sColVExp',
            axns: {
                edit_remove: ['.duplicate-row-btn', '.delete-row-btn'],
                el_w: '#TMPLs_iTr_health_sets',
                multi_select: { els: ['.health-set_Lmain-multi_select'] },
                multi_purps: { els: ['.health-set_Lmain_multiP'] },
            },
        },
        TabulatorInitOptions: {
            ajaxURL: 'php/iDBcode.php',
            sortMode: 'local',
            filterMode: 'local',
            renderVerticalBuffer: 10000,
            iTr_expand_multi_rows: true,
            // maxHeight: 1100,
            // minHeight: '500px',
            height: 200,
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },

            ajaxParams: function () {
                let params = {
                    recBY_fixedVal: row.getData()[expand_row_def['expandToKeyData']], // where fixedData = "female"  and defined once we expending a row from extandToDate
                    nested: true,
                };
                return params;
            },

            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region -columnsObj
            columnsObj: function () {
                // adding all other column configurations
                return [
                    /*{
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: '',
                        field: 'rowExpand',
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                        expandToKeyData : "gender",
                                                
                        formatter: function (cell, formatterParams, onRendered) {                            
                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered, expandRowWithNestedTable_Level2, row);
                            return el;
                        },   
                        increaseTblHeight: function(row){
                            $(CustomTabulator.TabulatorObj.element).attr('style', "height:800px !important");
                        },
                        scrollRowTblAfterLoad: function(row){
                            CustomTabulator.TabulatorObj.scrollToRow(row, "top", false)
                            // row.getElement().scrollIntoView({block:"end"});

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                        }
                    },
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,

                        titleFormatterParams: {
                            rowRange: 'active', //only toggle the values of the active filtered rows
                        },
                    },*/
                    // {field: 'rowSelection', width: 200,},
                    {
                        field: 'rowExpand',
                        expandTo: expandRowWithNestedTable_Level2,
                        // expandTblHeight_style: 'height:800px !important',
                        expandToKeyData: 'gender',
                    },
                    {
                        field: 'rowSelection',
                    },

                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: { cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
                        //                        field_1: 'isCurrentRow',
                        //                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function () {
                                success($(this).val());
                            });

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        iTr_headerFilter_by_ddFilter: {
                            type: 'multi-checkbox',
                        },
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        formatter: function (cell, formatterParams, onRendered) {
                            const uniqueId = `popoverButton_${cell.getRow().getIndex()}`; // Create unique ID for each cell's button
                            const uniqueClass = `custompopoverdropdown_${cell.getRow().getIndex()}`;
                            const $el_w = $(`<div class='d-flex'></div>`);
                            $el_w.append($(`<button>b1</button>`));
                            $el_w.append($(`<button class='custom_popover' id="${uniqueId}">b2</button>`)); // Use dynamic unique ID
                            $el_w.append($(`<button>b3</button>`));

                            // Popover content
                            const popoverContent = `
                            <div class="dropdown">
                              <ul class="dropdown-menu show" aria-labelledby="dropdownMenuButton">
                                <li><a class="dropdown-item" href="#">Action</a></li>
                                <li><a class="dropdown-item" href="#">Another action</a></li>
                                <li><a class="dropdown-item" href="#">Something else</a></li>
                              </ul>
                            </div>
                            `;

                            // Initialize popover only after the button has been rendered
                            onRendered(() => {
                                new bootstrap.Popover(`#${uniqueId}`, {
                                    html: true,
                                    content: popoverContent,
                                    trigger: 'manual',
                                    placement: 'right',
                                    sanitize: false,
                                    offset: [50, 40],
                                    customClass: `${uniqueClass} custompopoverdropdown`,
                                });
                            });

                            // Return the formatted HTML for Tabulator cell
                            return $el_w[0];
                        },
                        formatterParams: {
                            iTr_dropdown: true,
                            iTr_dropdown_type: 'button',
                            iDropdown_getlist: () => {
                                return [
                                    { label: 'Red', value: 'Red' },
                                    { label: 'Green', value: 'Green' },
                                    { label: 'Pink', value: 'Pink' },
                                    { label: 'Yellow', value: 'Yellow' },
                                    { label: 'Mauv', value: 'Mauv' },
                                    { label: 'Khaki', value: 'Khaki' },
                                    { label: 'Violet', value: 'Violet' },
                                    { label: 'Indigo', value: 'Indigo' },
                                    { label: 'Crimson', value: 'Crimson' },
                                    { label: 'Goldenrod', value: 'Goldenrod' },
                                ];
                            },
                            label: 'label',
                            value: 'value',
                            iTr_dropdown_ops: {
                                dd_el_w: { class: 'w-100' },
                                dd_calling_btn: { class: 'dd_arrow_end text-start py-1', reseizable: true },
                            },
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,
                        //
                        cellMouseEnter: function (event, cell) {
                            CustomTabulator.iTr_zoom_or_edit({}, 'MouseEnter', event, cell);
                        },
                        //                         cellMouseLeave: function (event, cell) {
                        //                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
                        //                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit(
                                { popo_z: { class: 'mb-0 close_on_scroll', style: 'background-color: #e7e7e9;' } },
                                'DblClick',
                                event,
                                cell
                            );
                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter: 'input',
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                    },
                    // {
                    //     title: 'Location',
                    //     field: 'location',
                    //     visible: isColumnVisible.call(this, 'location'),
                    //     width: 130,
                    //     headerFilter: (cell, onRendered, success, cancel) => {
                    //         const div = $(`<div class="location_header_select"></div>`);
                    //         return div[0];
                    //     },
                    //     // editor: 'input',
                    //     formatter: this.iTr_cell_editor_formatterEl,
                    //     editable: this.isFieldEditable,
                    //     validator: 'required',
                    //     editorParams: {
                    //         autocomplete: 'true',
                    //         allowEmpty: true,
                    //         listOnEmpty: true,
                    //         valuesLookup: true,
                    //     },
                    // },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="gender_header_select"></div>`);
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'gender-list');
                                $(input).prop('name', 'gender');
                                $(input).prop('id', 'gender');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    // {
                    //     title: 'Date Of Birth',
                    //     field: 'dob',
                    //     hozAlign: 'center',
                    //     width: 200,
                    //     resizable: true,
                    //     // editor: this.dateEditor,
                    //     editable: this.isFieldEditable,
                    //     headerFilter: this.headerDateEditor,
                    //     validator: 'required',
                    //     cssClass: 'dob-filter',
                    //     visible: isColumnVisible.call(this, 'dob'),
                    //     formatter: this.iTr_cell_date_editor_formatterEl,
                    //     // formatter: function (cell, formatterParams, onRendered) {
                    //     //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                    //     // },
                    // },
                    // {
                    //     title: 'Manufacturers',
                    //     field: 'manuf',
                    //     visible: isColumnVisible.call(this, 'manuf'),
                    //     width: 150,
                    //     // editor: 'input',
                    //     formatter: this.iTr_cell_editor_formatterEl,
                    //     headerSort: true,
                    //     editable: this.isFieldEditable,
                    //     headerFilter: 'input',
                    // },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 50,
                        print: false,
                        download: false,
                        headerSort: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                ];
            },
            //#endregion
            // </editor-fold>
        },
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
        },
    });

    CustomTabulator.TabulatorObj.on('dataLoading', () => {
        // scroll the row into view
        expand_row_def.scrollRowTblAfterLoad?.(row);
    });

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);

        // adding the dropdowns as table column names
        CustomTabulator.uniqueSelectDropdowns.headerFilters = {
            location: null, // later we will store the dropdown element reference
            gender: null,
        };

        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        /* 
        // -- for header filter in table - Location dropdown --
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(dropdown);

        // -- for header filter in table - Gender dropdown --
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(genderDropdown);
        */
        // </editor-fold>
    });
    //#endregion
    // </editor-fold>
}
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fn: expandRowWithNestedTable_Level2 ">
//#region -fn: expandRowWithNestedTable_Level2
function expandRowWithNestedTable_Level2(e, row) {
    // increase the height of the table row is expanded
    const expand_row_def = row.getCell('rowExpand').getColumn().getDefinition();
    // expand_row_def.increaseTblHeight?.(row);

    let btn = $(e.target).closest('button');
    $(btn).data('expanded', true).removeClass('btn-success').addClass('btn-danger');
    $('i', btn).removeClass('fa-plus').addClass('fa-minus');

    //    $(e.target).data('expanded', true);
    //    $(e.target).html('-');
    //    $(e.target).removeClass('bg-primary');
    //    $(e.target).addClass('bg-danger');

    // <button type="button" class="btnExpand btn btn-sm m-0 p-0 btn-danger"><i class="fas px-1 fa-minus"></i></button>
    // <button type="button" class="expand-btn btn btn-sm btn-success m-0 p-0"><i class="fas fa-plus px-1"></i></button>

    // <editor-fold defaultstate="collapsed" desc=" table's Data ">
    //#region -table's Data
    const tableId = row.getTable().element.id + `-nested-table-${row.getData().id}`;
    const tableContainer = `${tableId}-container`;

    // Add class to row element at the level
    // $(row.getElement()).addClass('row-expanded-lvl-2');
    // console.log({styling: $(row.getElement()).width()}, $(row.getElement()).closest(".table-container").width(), row.getElement())
    row.getTable().CustomTabulator.iTr_expTbl_fn_expandToEl(1, row, tableId, 800);

    // const tableHolder = $(row.getElement()).closest('.tabulator-tableholder');
    // const hasScroll = tableHolder[0].scrollHeight >= tableHolder[0].clientHeight;

    // $(row.getElement()).append(`
    //         <div class='${tableContainer} table-container p-2  itr-tbl-nested-2' style='width: ${
    //     hasScroll ? tableHolder.width() - getScrollbarWidth() : tableHolder.width()
    // }px'>
    //        <!--  <div class='${tableContainer} table-container p-2  itr-tbl-nested-2' style='width: ${
    //     $(row.getElement()).closest('.table-container').width() - 22
    // }px'>   -->
    //             <div class="table-header-toolbar_w px-2"></div>
    //             <div id="${tableId}" class="nested-table"></div>
    //         </div>`);

    // resize table width when it is resized
    // iTr_listen_resize(row);

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer: '.' + tableContainer,
        iTr_expTbl: true,
        iTr_expTbl_parentTbl: row.getTable().CustomTabulator,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        tbl_toolbar: {
            tmpl_name: 'editMultiP_sColVExp',
            axns: {
                edit_remove: ['.duplicate-row-btn', '.delete-row-btn'],
                el_w: '#TMPLs_iTr_health_sets',
                multi_select: { els: ['.health-set_Lmain-multi_select'] },
                multi_purps: { els: ['.health-set_Lmain_multiP'] },
            },
        },
        TabulatorInitOptions: {
            // maxHeight: '500px',
            // minHeight: '250px',
            // maxHeight: 1100,
            renderVerticalBuffer: 10000,
            height: 200,

            ajaxURL: 'php/iDBcode.php',
            ajaxParams: function () {
                let params = {
                    recBY: row.getData()['favourite'], // where fixedData = "female"  and defined once we expending a row from extandToDate
                    recBY_fixedVal: row.getData()[expand_row_def['expandToKeyData']], // where fixedData = "female"  and defined once we expending a row from extandToDate
                };
                return params;
            },
            sortMode: 'local',
            filterMode: 'local',
            iTr_expand_multi_rows: true,
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },

            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region -columnsObj
            columnsObj: function () {
                // adding all other column configurations
                return [
                    //                    {
                    //                        headerHozAlign: 'center',
                    //                        hozAlign: 'center',
                    //                        vertAlign: 'middle',
                    //                        headerSort: false,
                    //                        title: '',
                    //                        field: 'rowExpand',
                    //                        width: 30,
                    //                        print: false,
                    //                        download: false,
                    //                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    //
                    //
                    //                        formatter: function (cell, formatterParams, onRendered) {
                    //                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered, expandRowWithNestedTable_Level3);
                    //                            return el;
                    //                        },
                    //                        increaseTblHeight: function(){
                    //                            $(CustomTabulator.TabulatorObj.element).attr('style',"height:800px !important");
                    //                        },
                    //                        scrollRowTblAfterLoad: function(row){
                    //                            CustomTabulator.TabulatorObj.scrollToRow(row, "top", false)
                    //                            // row.getElement().scrollIntoView({block:"end"});
                    //
                    //                            // this is not working
                    //                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                    //                        }
                    //                    },
                    //                    {
                    //                        formatter: 'rowSelection',
                    //                        titleFormatter: 'rowSelection',
                    //                        headerHozAlign: 'center',
                    //                        hozAlign: 'center',
                    //                        vertAlign: 'middle',
                    //                        headerSort: false,
                    //                        title: 'Select',
                    //                        field: 'rowSelection',
                    //                        width: 60,
                    //                        print: false,
                    //                        download: false,
                    //
                    //                        titleFormatterParams: {
                    //                            rowRange: 'active', //only toggle the values of the active filtered rows
                    //                        },
                    //                    },
                    {
                        field: 'rowExpand',
                        expandTo: expandRowWithNestedTable_Level3,
                        // expandTblHeight_style: 'height:800px !important',
                    },
                    {
                        field: 'rowSelection',
                    },

                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: { cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
                        //                        field_1: 'isCurrentRow',
                        //                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function () {
                                success($(this).val());
                            });

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        minWidth: 200,
                        iTr_headerFilter_by_ddFilter: {
                            type: 'multi-checkbox',
                        },
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        iExcludeFromList: { src: 0 },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'browsers');
                                $(input).prop('name', 'browser');
                                $(input).prop('id', 'browser');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="browsers">
                                        <option value="Edge">
                                        <option value="Firefox">
                                        <option value="Chrome">
                                        <option value="Opera">
                                        <option value="Safari">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,
                        //
                        cellMouseEnter: function (event, cell) {
                            CustomTabulator.iTr_zoom_or_edit({}, 'MouseEnter', event, cell);
                        },
                        //                         cellMouseLeave: function (event, cell) {
                        //                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
                        //                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit(
                                { popo_z: { class: 'mb-0 close_on_scroll', style: 'background-color: #e7e7e9;' } },
                                'DblClick',
                                event,
                                cell
                            );
                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter: 'input',
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="location_header_select"></div>`);
                            return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="gender_header_select"></div>`);
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'gender-list');
                                $(input).prop('name', 'gender');
                                $(input).prop('id', 'gender');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 50,
                        print: false,
                        download: false,
                        headerSort: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                ];
            },
            //#endregion
            // </editor-fold>
        },
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
        },
    });

    CustomTabulator.TabulatorObj.on('dataLoading', () => {
        // scroll the row into view
        expand_row_def.scrollRowTblAfterLoad?.(row);
    });

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);

        // adding the dropdowns as table column names
        CustomTabulator.uniqueSelectDropdowns.headerFilters = {
            location: null, // later we will store the dropdown element reference
            gender: null,
        };

        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        /*      
        // -- for header filter in table - Location dropdown -- 
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(dropdown);

        // -- for header filter in table - Gender dropdown --        
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(genderDropdown);
        */
        // </editor-fold>
    });
    //#endregion
    // </editor-fold>
}
//#endregion
// </editor-fold>
// <editor-fold defaultstate="collapsed" desc=" fn: expandRowWithNestedTable_Level3 ">
//#region -fn: expandRowWithNestedTable_Level3
function expandRowWithNestedTable_Level3(e, row) {
    // increase the height of the table row is expanded
    // increase the height of the table row is expanded
    const expand_row_def = row.getCell('rowExpand').getColumn().getDefinition();
    // expand_row_def.increaseTblHeight?.(row);

    let btn = $(e.target).closest('button');
    $(btn).data('expanded', true).removeClass('btn-success').addClass('btn-danger');
    $('i', btn).removeClass('fa-plus').addClass('fa-minus');

    //    $(e.target).data('expanded', true);
    //    $(e.target).html('-');
    //    $(e.target).removeClass('bg-primary');
    //    $(e.target).addClass('bg-danger');

    // <button type="button" class="btnExpand btn btn-sm m-0 p-0 btn-danger"><i class="fas px-1 fa-minus"></i></button>
    // <button type="button" class="expand-btn btn btn-sm btn-success m-0 p-0"><i class="fas fa-plus px-1"></i></button>

    // <editor-fold defaultstate="collapsed" desc=" table's Data ">
    //#region -table's Data
    const tableId = row.getTable().element.id + `-nested-table-${row.getData().id}`;
    const tableContainer = `${tableId}-container`;

    row.getTable().CustomTabulator.iTr_expTbl_fn_expandToEl(1, row, tableId, 800);

    // const tableHolder = $(row.getElement()).closest('.tabulator-tableholder');
    // const hasScroll = tableHolder[0].scrollHeight >= tableHolder[0].clientHeight;

    // // Add class to row element at the level
    // $(row.getElement()).addClass('row-expanded-lvl-3');
    // $(row.getElement()).append(`
    //         <div class='${tableContainer} table-container p-2  itr-tbl-nested-3' style='width: ${
    //     hasScroll ? tableHolder.width() - getScrollbarWidth() : tableHolder.width()
    // }px'>
    //             <div class="table-header-toolbar_w px-2"></div>
    //             <div id="${tableId}" class="nested-table"></div>
    //         </div>`);

    // resize table width when it is resized
    // iTr_listen_resize(row);

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer: '.' + tableContainer,
        iTr_expTbl: true,
        iTr_expTbl_parentTbl: row.getTable().CustomTabulator,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        tbl_toolbar: {
            tmpl_name: 'editMultiP_sColVExp',
            axns: {
                edit_remove: ['.duplicate-row-btn', '.delete-row-btn'],
                el_w: '#TMPLs_iTr_health_sets',
                multi_select: { els: ['.health-set_Lmain-multi_select'] },
                multi_purps: { els: ['.health-set_Lmain_multiP'] },
            },
        },
        TabulatorInitOptions: {
            // maxHeight: '500px',
            // minHeight: '250px',
            renderVerticalBuffer: 10000,
            height: 500,
            iTr_expand_multi_rows: true,
            ajaxURL: 'php/iDBcode.php',
            sortMode: 'local',
            filterMode: 'local',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region -columnsObj
            columnsObj: function () {
                // adding all other column configurations
                return [
                    //                    {
                    //                        headerHozAlign: 'center',
                    //                        hozAlign: 'center',
                    //                        vertAlign: 'middle',
                    //                        headerSort: false,
                    //                        title: '',
                    //                        field: 'rowExpand',
                    //                        width: 30,
                    //                        print: false,
                    //                        download: false,
                    //                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    //
                    //
                    //                        formatter: function (cell, formatterParams, onRendered) {
                    //                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered, expandRowWithNestedTable_Level4);
                    //                            return el;
                    //                        },
                    //                        increaseTblHeight: function(){
                    //                            $(CustomTabulator.TabulatorObj.element).attr('style',"height:800px !important");
                    //                        },
                    //                        scrollRowTblAfterLoad: function(row){
                    //                            CustomTabulator.TabulatorObj.scrollToRow(row, "top", false)
                    //                            // row.getElement().scrollIntoView({block:"end"});
                    //
                    //                            // this is not working
                    //                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"})
                    //                        }
                    //                    },
                    //                    {
                    //                        formatter: 'rowSelection',
                    //                        titleFormatter: 'rowSelection',
                    //                        headerHozAlign: 'center',
                    //                        hozAlign: 'center',
                    //                        vertAlign: 'middle',
                    //                        headerSort: false,
                    //                        title: 'Select',
                    //                        field: 'rowSelection',
                    //                        width: 60,
                    //                        print: false,
                    //                        download: false,
                    //
                    //                        titleFormatterParams: {
                    //                            rowRange: 'active', //only toggle the values of the active filtered rows
                    //                        },
                    //                    },

                    {
                        field: 'rowExpand',
                        expandTo: expandRowWithNestedTable_Level4,
                        expandTblHeight_style: 'height:800px !important',
                    },
                    {
                        field: 'rowSelection',
                    },

                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: { cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
                        //                        field_1: 'isCurrentRow',
                        //                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function () {
                                success($(this).val());
                            });

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        iExcludeFromList: { src: 0 },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'browsers');
                                $(input).prop('name', 'browser');
                                $(input).prop('id', 'browser');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="browsers">
                                        <option value="Edge">
                                        <option value="Firefox">
                                        <option value="Chrome">
                                        <option value="Opera">
                                        <option value="Safari">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,
                        //
                        cellMouseEnter: function (event, cell) {
                            CustomTabulator.iTr_zoom_or_edit({}, 'MouseEnter', event, cell);
                        },
                        //                         cellMouseLeave: function (event, cell) {
                        //                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
                        //                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit(
                                { popo_z: { class: 'mb-0 close_on_scroll', style: 'background-color: #e7e7e9;' } },
                                'DblClick',
                                event,
                                cell
                            );
                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter: 'input',
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="location_header_select"></div>`);
                            return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="gender_header_select"></div>`);
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'gender-list');
                                $(input).prop('name', 'gender');
                                $(input).prop('id', 'gender');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 50,
                        print: false,
                        download: false,
                        headerSort: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                ];
            },
            //#endregion
            // </editor-fold>
        },
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
        },
    });

    CustomTabulator.TabulatorObj.on('dataLoading', () => {
        // scroll the row into view
        expand_row_def.scrollRowTblAfterLoad?.(row);
    });

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);

        // adding the dropdowns as table column names
        CustomTabulator.uniqueSelectDropdowns.headerFilters = {
            location: null, // later we will store the dropdown element reference
            gender: null,
        };

        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        /* 
        // -- for header filter in table - Location dropdown --
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(dropdown);

        // -- for header filter in table - Gender dropdown --
        //#region -for header filter in table - gender dropdown
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(genderDropdown);
        */
        // </editor-fold>
    });
    //#endregion
    // </editor-fold>
}
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fn: expandRowWithNestedTable_Level4 ">
//#region -fn: expandRowWithNestedTable_Level4
function expandRowWithNestedTable_Level4(e, row) {
    // increase the height of the table row is expanded
    const expand_row_def = row.getCell('rowExpand').getColumn().getDefinition();
    // expand_row_def.increaseTblHeight?.(row);

    let btn = $(e.target).closest('button');
    $(btn).data('expanded', true).removeClass('btn-success').addClass('btn-danger');
    $('i', btn).removeClass('fa-plus').addClass('fa-minus');

    // <editor-fold defaultstate="collapsed" desc=" table's Data ">
    //#region -table's Data
    const tableId = row.getTable().element.id + `-nested-table-${row.getData().id}`;
    const tableContainer = `${tableId}-container`;

    row.getTable().CustomTabulator.iTr_expTbl_fn_expandToEl(1, row, tableId, 800);
    // const tableHolder = $(row.getElement()).closest('.tabulator-tableholder');
    // const hasScroll = tableHolder[0].scrollHeight >= tableHolder[0].clientHeight;

    // // Add class to row element at the level
    // $(row.getElement()).addClass('row-expanded-lvl-4');
    // $(row.getElement()).append(`
    //         <div class='${tableContainer} table-container p-2  itr-tbl-nested-4' style='width: ${
    //     hasScroll ? tableHolder.width() - 22 : tableHolder.width()
    // }px'>
    //             <div class="table-header-toolbar_w px-2"></div>
    //             <div id="${tableId}" class="nested-table"></div>
    //         </div>`);
    // resize table width when it is resized
    // iTr_listen_resize(row);

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer: '.' + tableContainer,
        iTr_expTbl: true,
        iTr_expTbl_parentTbl: row.getTable().CustomTabulator,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        tbl_toolbar: {
            tmpl_name: 'editMultiP_sColVExp',
            axns: {
                edit_remove: ['.duplicate-row-btn', '.delete-row-btn'],
                el_w: '#TMPLs_iTr_health_sets',
                multi_select: { els: ['.health-set_Lmain-multi_select'] },
                multi_purps: { els: ['.health-set_Lmain_multiP'] },
            },
        },
        TabulatorInitOptions: {
            // minHeight: '500px',
            height: '500px',
            renderVerticalBuffer: 10000,
            ajaxURL: 'php/iDBcode.php',
            sortMode: 'local',
            filterMode: 'local',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            iTr_expand_multi_rows: true,
            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region -columnsObj
            columnsObj: function () {
                // adding all other column configurations
                return [
                    //                    {
                    //                        formatter: 'rowSelection',
                    //                        titleFormatter: 'rowSelection',
                    //                        headerHozAlign: 'center',
                    //                        hozAlign: 'center',
                    //                        vertAlign: 'middle',
                    //                        headerSort: false,
                    //                        title: 'Select',
                    //                        field: 'rowSelection',
                    //                        width: 60,
                    //                        print: false,
                    //                        download: false,
                    //
                    //                        titleFormatterParams: {
                    //                            rowRange: 'active', //only toggle the values of the active filtered rows
                    //                        },
                    //                    },

                    {
                        field: 'rowSelection',
                    },

                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: { cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
                        //                        field_1: 'isCurrentRow',
                        //                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function () {
                                success($(this).val());
                            });

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        iExcludeFromList: { src: 0 },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'browsers');
                                $(input).prop('name', 'browser');
                                $(input).prop('id', 'browser');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="browsers">
                                        <option value="Edge">
                                        <option value="Firefox">
                                        <option value="Chrome">
                                        <option value="Opera">
                                        <option value="Safari">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,
                        //
                        cellMouseEnter: function (event, cell) {
                            CustomTabulator.iTr_zoom_or_edit({}, 'MouseEnter', event, cell);
                        },
                        //                         cellMouseLeave: function (event, cell) {
                        //                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
                        //                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit(
                                { popo_z: { class: 'mb-0 close_on_scroll', style: 'background-color: #e7e7e9;' } },
                                'DblClick',
                                event,
                                cell
                            );
                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter: 'input',
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="location_header_select"></div>`);
                            return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="gender_header_select"></div>`);
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'gender-list');
                                $(input).prop('name', 'gender');
                                $(input).prop('id', 'gender');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 50,
                        print: false,
                        download: false,
                        headerSort: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                ];
            },
            //#endregion
            // </editor-fold>
        },
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
        },
    });

    CustomTabulator.TabulatorObj.on('dataLoading', () => {
        // scroll the row into view
        expand_row_def.scrollRowTblAfterLoad?.(row);
    });

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);

        // adding the dropdowns as table column names
        CustomTabulator.uniqueSelectDropdowns.headerFilters = {
            location: null, // later we will store the dropdown element reference
            gender: null,
        };

        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        /* 
        // -- for header filter in table - Location dropdown --
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(dropdown);

        // --  for header filter in table - Gender dropdown --
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(genderDropdown);
        */
        // </editor-fold>
    });
    //#endregion
    // </editor-fold>
}
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" JSON_input ">
//#region Itsik table-local
let J_input = () => {
    const tableId = 'J_input';
    const tableContainer = '.J_input-container';

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        tbl_toolbar: {
            tmpl_name: 'editMultiP_sColVExp',
            axns: {
                edit_remove: ['.duplicate-row-btn', '.delete-row-btn'],
                el_w: '#TMPLs_iTr_health_sets',
                multi_select: { els: ['.health-set_Lmain-multi_select'] },
                multi_purps: { els: ['.health-set_Lmain_multiP'] },
            },
        },
        TabulatorInitOptions: {
            ajaxURL: 'php/iDBcode.php',
            data: dbRows,
            //             ajaxURL: 'https://dev1a.ai-rgus.com/php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php',
            rowHeight: 40,
            sortMode: 'local',
            filterMode: 'local',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            pagination: false,
            height: `${$('.table_w').height() - 250}px`, // we do not yet have the real table position or the table header element

            //  We do not use this option as it create other issue. We manage these thing ourself by creating custom checkbox and it's state
            //            selectableRows:true,
            //                rowHeader: {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
            //                    rowRange:"active" //only toggle the values of the active filtered rows
            //                }, hozAlign:"center", headerSort:false},

            // iTr_ajaxResponse: function (url, params, response) {
            //     //                iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
            //     return response['dtRows'];
            // },

            iTr_add_new_row_before: function (fieldData) {
                // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
                fieldData.chbox = 1;
                fieldData.chbox2 = 0;
                fieldData.name = 'New Data';
                return true;
            },
            iTr_add_new_row_after: function (fieldData) {},

            iTr_row_save_before: function (TabulatorObj, ...fieldData) {
                iConsole('------------ iTr_row_save_before --------------');
                iConsole({ fieldData }, TabulatorObj);
                return true;
            },

            iTr_row_save_after: function (newData) {
                $.ajax({
                    method: 'POST',
                    url: 'php/update-user.php',
                    dataType: 'json',
                    headers: {
                        csrftoken: _userStr,
                    },
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(newData),
                }).done((res) => {
                    if (res.success == 1) {
                        CustomTabulator.updateRowStatus();
                    } else {
                        alert(res.data?.error || 'Something went wrong');
                    }
                });
            },

            printHeader: function () {
                return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
            },
            printFooter: function () {
                const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');

                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                <div class="d-flex gap-2">
                    <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                    <span class='fs-6'>${timeStamp}</span>
                </div>
            </div>`;
            },
            printFormatter: (tableHolder, table) => {
                $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                $(table).find('thead th').css({ 'font-size': '11px' });
                $(table).find('tbody td').css({ 'font-size': '12px' });
            },
            printRowRange: 'all',

            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region columnsObj
            columnsObj: function () {
                return [
                    {
                        field: 'rowExpand',
                        expandTo: expandRowWithNestedTable_Jinput_Level1,
                        // expandTblHeight_style : "height:1100px !important",
                        visible: false,
                        expandToKeyData: 'gender',
                    },
                    {
                        field: 'rowSelection',
                    },

                    {
                        title: 'ID',
                        field: 'id',
                        visible: isColumnVisible.call(this, 'id'),
                        resizable: false,
                        frozen: true,
                        width: 60,
                        sorter: 'number',
                        iExcludeFromList: { cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: '',
                        field: 'btns',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'clientName'),
                        editable: this.isFieldEditable,
                        frozen: true,
                        width: 150,
                        sorter: 'string',
                        // headerFilter: 'input',
                        formatter: function (cell, formatterParams, onRendered) {
                            let rslt = $('<span></span>');

                            var btns = cell
                                .getValue()
                                .split('/')
                                .map(function (item) {
                                    return item.trim();
                                });
                            $.each(btns, function (index, btn) {
                                switch (btn) {
                                    case 'btnExpand':
                                        btnExpand = CustomTabulator.cellF_rowExpand(
                                            cell,
                                            formatterParams,
                                            onRendered,
                                            expandRowWithNestedTable_Jinput_Level1
                                        );
                                        rslt.append(btnExpand);

                                        break;
                                    case 'btnCog':
                                        //                                        rslt += `<button type="button" class="btn btn-primary">btnCog</button>`;
                                        btnCog = $(`<button type="button" class="btn btn-primary">btnCog</button>`).on('click', () => {
                                            console.log('PPPPPPPPPPPPPPPPPPPPPPP');
                                        });
                                        rslt.append(btnCog);

                                        break;
                                    case 'btnEmail':
                                        break;
                                }
                            });
                            //                            return rslt.prop("outerHTML");
                            return rslt[0];
                        },
                    },
                    {
                        title: 'Client',
                        field: 'clientName',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'clientName'),
                        editable: this.isFieldEditable,
                        frozen: true,
                        width: 150,
                        sorter: 'string',
                        headerFilter: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Date',
                        field: 'date',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'dat'),
                        editable: this.isFieldEditable,
                        width: 140,
                        sorter: 'datetime',
                        headerFilter: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Device name',
                        field: 'deviceN',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'deviceN'),
                        editable: this.isFieldEditable,
                        width: 200,
                        sorter: 'string',
                        headerFilter: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Problem',
                        field: 'status',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'deviceN'),
                        editable: this.isFieldEditable,
                        width: 200,
                        sorter: 'string',
                        headerFilter: 'input',
                        formatter: function (cell, formatterParams, onRendered) {
                            let rslt = '';

                            var icons = cell
                                .getValue()
                                .split('/')
                                .map(function (item) {
                                    return item.trim();
                                });
                            $.each(icons, function (index, icon) {
                                rslt += CustomTabulator.iTr_get_icon_element(icon, { class: 'text-danger me-2' });
                            });

                            return rslt;
                        },
                        //
                    },
                    {
                        title: 'Image Quality',
                        field: 'viewAI',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'deviceN'),
                        editable: this.isFieldEditable,
                        width: 150,
                        sorter: 'string',
                        headerFilter: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'IP',
                        field: 'ip',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'deviceN'),
                        editable: this.isFieldEditable,
                        width: 150,
                        sorter: 'string',
                        headerFilter: 'input',

                        formatter: function (cell, formatterParams, onRendered) {
                            let aa = `<a href="${cell.getValue()}">${cell.getValue()}</a>`;
                            return aa;
                        },
                    },
                    {
                        title: 'filter by',
                        field: 'dt_filter',
                        validator: 'required',
                        visible: false,
                        editable: this.isFieldEditable,
                        width: 150,
                        sorter: 'string',
                        headerFilter: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 50,
                        print: false,
                        download: false,
                        headerSort: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                ];
            },
            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -iTr_rowFormatter_ before|after
            iTr_rowFormatter_before: function (row) {
                //                iConsole("------------ Table obj's rowFormatter Before ------------  ");

                var data = row.getData();
                //                if(data.isCurrentRow?.edit_mode || data.isCurrentRow?.edit_mode)
                $(row.getElement()).attr('data-location', data.location);

                if (data.location == 'India') {
                    row.getCell('location').getElement().style.color = 'blue';
                }
                if (data.location == 'China') {
                    $(row.getElement()).addClass('china');

                    // add custom html to the cell
                    row.getCell('location').getElement().innerHTML = `<a href='google.com'>${data.location}</a>`;
                }

                if (row.getData().isCurrentRow?.edit_mode) {
                    $(row.getElement()).removeClass('china');
                }

                return true;
            },
            iTr_rowFormatter_after: function (row) {
                //                iConsole("------------ Table obj's rowFormatter After ------------  ");
            },

            //#endregion
            // </editor-fold>
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
        },
        //#endregion
        // </editor-fold>
    });
    window.tempTable = CustomTabulator; // +info+ adding to global object to access it from developer tools and anywhere else in the code for debugging

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);

        // adding the dropdowns as table column names
        CustomTabulator.uniqueSelectDropdowns.headerFilters = {
            location: null, // later we will store the dropdown element reference
            gender: null,
        };

        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        /*
        // -- for header filter in table - Location dropdown --
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".itsik-table-container")))[0]).append(dropdown);

        // -- for header filter in table - Gender dropdown --
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
//        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".J_input-container")))[0]).append(genderDropdown);
        
        $(".tbl_multy_purps_w", $(CustomTabulator["tableContainerElement"])).append($(".filterTbl_by_AIisok"))
            .on("click", (e)=>{
                let filterBy = $(e.target).attr("data-filter_by");
                    console.log(filterBy);

//                CustomTabulator.TabulatorObj.setFilter("dt_filter", "like", "-CamNotLive-");
                CustomTabulator.TabulatorObj.setFilter("dt_filter", "like", filterBy);
            });
        */
        // </editor-fold>
    });
};
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" Settings_input ">
//#region Settings_input
let JSON_Settings_input = () => {
    var _mapObj = {
        all: 'ALL',
        1: 'Blur',
        2: 'Tilt',
        3: 'Block',
        4: 'Camera liveness',
        6: 'Glare',
        7: 'Fault',
        8: 'Low light',
        21: 'Camera recordings',
    };
    let camInfo = {}; // required for mute functions

    const tableId = 'JSettings_input';
    const tableContainer = `.${tableId}-container`;

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        //        _tbl_format : "TMPL_tbl_toolbars_f01",
        //        _tbl_controlers : {
        //            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tbl_multy_purps':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblColVisibility':{"c": "me-2"}},{'tblExport':{"c": "me-2"}},{'tblSettings':{"c": ""}}]
        //        },
        TabulatorInitOptions: {
            //            ajaxURL: 'php/iDBcode.php',
            data: settings_data,
            //             ajaxURL: 'https://dev1a.ai-rgus.com/php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php',
            rowHeight: 40,
            sortMode: 'local',
            filterMode: 'local',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            pagination: false,
            height: `${$('.table_w').height() - 250}px`, // we do not yet have the real table position or the table header element

            //  We do not use this option as it create other issue. We manage these thing ourself by creating custom checkbox and it's state
            //            selectableRows:true,
            //                rowHeader: {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
            //                    rowRange:"active" //only toggle the values of the active filtered rows
            //                }, hozAlign:"center", headerSort:false},

            // iTr_ajaxResponse: function (url, params, response) {
            //     //                iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
            //     return response['dtRows'];
            // },

            iTr_add_new_row_before: function (fieldData) {
                // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
                fieldData.chbox = 1;
                fieldData.chbox2 = 0;
                fieldData.name = 'New Data';
                return true;
            },
            iTr_add_new_row_after: function (fieldData) {},

            iTr_row_save_before: function (TabulatorObj, ...fieldData) {
                iConsole('------------ iTr_row_save_before --------------');
                iConsole({ fieldData }, TabulatorObj);
                return true;
            },

            iTr_row_save_after: function (newData) {
                $.ajax({
                    method: 'POST',
                    url: 'php/update-user.php',
                    dataType: 'json',
                    headers: {
                        csrftoken: _userStr,
                    },
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(newData),
                }).done((res) => {
                    if (res.success == 1) {
                        CustomTabulator.updateRowStatus();
                    } else {
                        alert(res.data?.error || 'Something went wrong');
                    }
                });
            },

            printHeader: function () {
                return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
            },
            printFooter: function () {
                const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');

                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                <div class="d-flex gap-2">
                    <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                    <span class='fs-6'>${timeStamp}</span>
                </div>
            </div>`;
            },
            printFormatter: (tableHolder, table) => {
                $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                $(table).find('thead th').css({ 'font-size': '11px' });
                $(table).find('tbody td').css({ 'font-size': '12px' });
            },
            printRowRange: 'all',

            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region columnsObj
            columnsObj: function () {
                return [
                    { field: 'rowSelection' },
                    { field: 'id' },
                    {
                        title: 'Client',
                        field: 'cdsy_names',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'cdsy_names'),
                        editable: this.isFieldEditable,
                        frozen: true,
                        width: 250,
                        sorter: 'string',
                        //                        sorter: customSorter,
                        headerFilter: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Recorder',
                        field: 'rec_name',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'rec_name'),
                        editable: this.isFieldEditable,
                        frozen: true,
                        width: 200,
                        sorter: 'string',
                        //                        sorter: customSorter,
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="rec_name_header_select position-relative t-n1d2"></div>`);
                            return div[0];
                        },
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Camera',
                        field: 'cam_name',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'cam_name'),
                        editable: this.isFieldEditable,
                        frozen: true,
                        width: 250,
                        sorter: 'string',
                        //                        sorter: customSorter,
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="cam_name_header_select position-relative t-n1d2"></div>`);
                            return div[0];
                        },
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Recorder info.',
                        field: 'rec_info',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'rec_info'),
                        editable: this.isFieldEditable,
                        width: 250,
                        sorter: 'string',
                        //                        sorter: customSorter,
                        headerFilter: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Camera info',
                        field: 'cam_info',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'cam_info'),
                        editable: this.isFieldEditable,
                        width: 250,
                        sorter: 'string',
                        //                        sorter: customSorter,
                        //                        headerFilter: 'input',
                        headerFilter: (cell, onRendered, success, cancel) => {
                            let div = $(`<div class="cam_info_header_select position-relative t-n1d2"></div>`);
                            return div[0];
                        },
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'PTZ?',
                        field: 'ptz',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'ptz'),
                        editable: this.isFieldEditable,
                        width: 90,
                        sorter: 'number',
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            // console.log('--- ch box, headerFilter -----------');
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });
                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        // <editor-fold defaultstate="collapsed" desc=" formatter">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue(), {
                                    el_class_by_val: { 0: '', 1: 'far fa-check' },
                                });
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Mute untill',
                        field: 'mute_untill',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'mute_untill'),
                        editable: this.isFieldEditable,
                        width: 120,
                        sorter: 'string',
                        hozAlign: 'center',
                        headerFilter: 'input',
                        cssClass: 'text-danger',
                        titleFormatter: function (cell, formatterParams, onRendered) {
                            onRendered(function () {
                                $(cell.getElement()).closest('.tabulator-col').removeClass('text-danger');
                            });
                            return 'Mute untill';

                            // now it is not exist therefor I use onRendered : https://tabulator.info/docs/6.3/format#main-contents
                            // $(cell.getElement()).closest(".tabulator-col").removeClass("text-danger");

                            //                            let $el = $("<div>").addClass(".tabulator-header ").text("Client Name");
                            //                            return $el[0];

                            //                            return $('<div>', {
                            //                                class: 'text-custom',
                            //                                html: 'Client Name'
                            //                            })[0];
                        },
                        //                        formatter: this.iTr_cell_editor_formatterEl,

                        formatter: (cell, formatterParams, onRendered) => {
                            let rtn = '';
                            if (cell.getValue() !== null) {
                                rtn = `${CustomTabulator.iTr_get_icon_element('iMute')} ${cell.getValue()}`;
                            }
                            return rtn;
                        },
                    },
                    {
                        title: 'What to mute',
                        field: 'mute_what',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'mute_what'),
                        editable: this.isFieldEditable,
                        width: 400,
                        sorter: 'string',
                        headerFilter: 'input',

                        cssClass: 'text-danger',
                        titleFormatter: function (cell, formatterParams, onRendered) {
                            onRendered(function () {
                                $(cell.getElement()).closest('.tabulator-col').removeClass('text-danger');
                            });
                            return 'What to mute';
                        },
                        formatter: (cell, formatterParams, onRendered) => {
                            let mFor = [];
                            $(cell.getValue()?.split(',')).each(function () {
                                if (this !== '') {
                                    mFor.push(_mapObj[this]);
                                }
                            });

                            let string = mFor.join(', ');
                            cell.getData()['mute_what'] = string;
                            return string;
                        },
                    },
                    {
                        field: '__dummy__',
                    },
                ];
            },
            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -iTr_rowFormatter_ before|after
            iTr_rowFormatter_before: function (row) {
                //                iConsole("------------ Table obj's rowFormatter Before ------------  ");

                var data = row.getData();
                //                if(data.isCurrentRow?.edit_mode || data.isCurrentRow?.edit_mode)
                $(row.getElement()).attr('data-location', data.location);

                if (data.location == 'India') {
                    row.getCell('location').getElement().style.color = 'blue';
                }
                if (data.location == 'China') {
                    $(row.getElement()).addClass('china');

                    // add custom html to the cell
                    row.getCell('location').getElement().innerHTML = `<a href='google.com'>${data.location}</a>`;
                }

                if (row.getData().isCurrentRow?.edit_mode) {
                    $(row.getElement()).removeClass('china');
                }

                return true;
            },
            iTr_rowFormatter_after: function (row) {
                //                iConsole("------------ Table obj's rowFormatter After ------------  ");
            },
            //#endregion
            // </editor-fold>
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
        },
        //#endregion
        // </editor-fold>
    });
    window.tempTable = CustomTabulator; // +info+ adding to global object to access it from developer tools and anywhere else in the code for debugging

    // <editor-fold defaultstate="collapsed" desc=" on: tableBuilt ">
    //#region -on: tableBuilt
    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // do NOT use clone(true) as we want to define here the click function
        let $mute_for_btn = $('#mute_for')
            .clone()
            .removeAttr('id')
            .addClass('iTr_mute_btn-for_mute bypass_def_btn_style me-4') //; // .attr("id", "mute_for").removeClass("d-none");
            .on('click', () => {
                _CustomTabulator = CustomTabulator;
                camInfo['muteFor'] = null;
                mute_open_modal({ memo: '' });
            });
        $('.tbl_multy_purps_w', $(CustomTabulator['tableContainerElement'])).removeClass('align-content-end').append($mute_for_btn);

        // do NOT use clone(true) as we want to define here the click function
        let $unmute_for_btn = $('#setting_unmute')
            .clone()
            .removeAttr('id')
            .addClass('iTr_mute_btn-for_unmute bypass_def_btn_style') //; //.attr("id", "mute_for").removeClass("d-none");
            .on('click', () => {
                _CustomTabulator = CustomTabulator;
                mute_unmute_DoIT('unmute');
            });
        $('.tbl_multy_purps_w', $(CustomTabulator['tableContainerElement'])).append($unmute_for_btn);

        // <editor-fold defaultstate="collapsed" desc=" header filter rows button for: rec_name ">
        //#region -header filter rows button
        // dropdowns
        // recorder select dropdown for header
        let uniqueRecordars = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.rec_name] = (acc[obj.rec_name] || 0) + 1;
            return acc;
        }, {});
        let uniqueRecordarsArray = Object.entries(uniqueRecordars).map(([rec_name, count]) => {
            return {
                field: rec_name,
                title: `${rec_name} (<span data-counter="${count}" class="selected">0</span>/${count})`,
                visible: true,
                dinm_dd_toCcheck: false,
            };
        });
        uniqueRecordarsArray.sort((a, b) => a.field.localeCompare(b.field));

        const rec_col_header_dd = iGet_el_SelectDropdown({
            el_w: { class: 'move_ddown_to_body d-inline' },
            calling_btn: {
                class: 'form-control form-control-sm border w-75 py-1',
                _style: 'border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;',
                icon: { class: 'fa-line-columns fa-filter' },
                alt_el: `<span class="pe-2">Filter by</span>`,
            },
            dd_element: { class: 'iTr_F_01', style: 'width:450px; height:400px' },
            dd_title: { text: 'Select recorders' },
            dd_filter: { input: { placeholder: 'Search recorder...' } },
            //            dd_select_all:{ text:{ched:"Show all", clear:"n/a"} },
            dd_select_all: { class: 'd-none' },
            dd_select_list: { data: uniqueRecordarsArray, exludeBy: 'src', style: 'width:440px; height:100%; overflow-y:auto;' },
            TabulatorObj: CustomTabulator.TabulatorObj,
            // <editor-fold defaultstate="collapsed" desc=" fn_onSelectAllChange - n/a we do not show this button ">
            //#region -fn_onSelectAllChange - n/a we do not show this button
            fn_onSelectAllChange: (e, ops) => {
                ops.TabulatorObj.setFilter();
                $('input.form-check-input', drop_down).prop('checked', 0);
                setTimeout(() => {
                    iBS_hideAll_Dropdowns();
                }, 250);
                // updating the select rows count(in label) for the select checkebox
                const counter_el = $(e.target).closest('.form-check').find('.selected');
                counter_el.empty().text(counter_el.attr('data-counter'));
            },
            //#endregion
            // </editor-fold>
            // <editor-fold defaultstate="collapsed" desc=" fn_onInptChkChange ">
            //#region -fn_onInptChkChange
            fn_onInptChkChange: (e, ops) => {
                let $dds_itemsList_w = $(e.target).closest('.dds_itemsList_w');
                let chs_selected = $('input.form-check-input:checked', $dds_itemsList_w).length > 0;

                $('button span', rec_col_header_dd).text(chs_selected ? 'Apply filter' : 'Filter by');
                $('.btn_restFilter_recoder', $('button', rec_col_header_dd).closest('.rec_name_header_select')).prop(
                    'disabled',
                    !chs_selected
                );
            },
            //#endregion
            // </editor-fold>
            // <editor-fold defaultstate="collapsed" desc=" COMMENT: in case we want the on click to hide the table's rows ">
            //#region -in case we want the on click to hide the table's rows
            __fn_onInptChkChange: (e, ops) => {
                const search_val = $(e.target).attr('value');

                if ($(e.target).prop('checked')) {
                    ops.TabulatorObj.setFilter('rec_name', '=', search_val);
                    //                    setTimeout(()=>{
                    //                        iBS_hideAll_Dropdowns();
                    //                    },250);

                    //                    $(e.target).prop("checked", false);
                    //                    ops.TabulatorObj.getRows().map((row)=>{
                    //                        if(row.getData().rec_name != search_val){
                    //                            row.hide();
                    //                        }
                    //                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest('.form-check').find('.selected');
                    counter_el.empty().text(counter_el.attr('data-counter'));
                }
                //                else {
                //                    // console.log({col}, 'uncheck')
                //                    ops.TabulatorObj.getRows().map((row)=>{
                //                        if(row.getData().rec_name == search_val){
                //                            row.show();
                //                        }
                //                    });
                //                    // updating the select rows count(in label) for the select checkebox
                //                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                //                    counter_el.empty().text('0');
                //                }
            },
            //#endregion
            // </editor-fold>
            // <editor-fold defaultstate="collapsed" desc=" fn_onDropdown_shown ">
            //#region -fn_onDropdown_shown
            fn_onDropdown_shown: (e, ops) => {
                // <editor-fold defaultstate="collapsed" desc=" seeting the checked counters next to each checkbox ">
                //#region -seeting the checked counters next to each checkbox
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.rec_name] = (acc[obj.rec_name] || 0) + 1;
                    return acc;
                }, {});

                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', rec_col_header_dd).attr('id');
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input', drop_down).prop('checked', 0);
                $('.selected', drop_down).text('0');

                $.each(selected_counts, function (key, value) {
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr('id')}"]`).attr('id');
                    $('.selected', `label[for="${id}"]`).text(value);
                });
                //#endregion
                // </editor-fold>

                // <editor-fold defaultstate="collapsed" desc=" restoring the checked to the filter fields ">
                //#region -restoring the checked to the filter fields
                var filters = ops.TabulatorObj.getFilters();
                $.each(filters, function (index, innerArray) {
                    $.each(innerArray, function (i, filter) {
                        $(`input.form-check-input[value="${filter.value}"]`, drop_down).prop('checked', 1);
                    });
                });
                //#endregion
                // </editor-fold>

                return true;
            },
            //#endregion
            // </editor-fold>
            // <editor-fold defaultstate="collapsed" desc=" fn_onDropdown_hidden ">
            //#region -fn_onDropdown_hidden
            fn_onDropdown_hidden: (e, ops) => {
                console.log('hide');
                $('button span', rec_col_header_dd).text('Select');
                const dropdown_id = $('button', rec_col_header_dd).attr('id');
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');

                /* let filters = [];
                $("input.form-check-input:checked" ,drop_down).each(function(){               
                    filters.push({field:"rec_name", type:"=", value:$(this).val()});
                });
                
//                filters.push({field:"cam_info", type:"=", value:"Axis Q17"});
                
                ops.TabulatorObj.setFilter([filters]);
                */

                filter_tblData(CustomTabulator, drop_down, 'rec_name');

                return true;
            },
            //#endregion
            // </editor-fold>
        });
        $($('.rec_name_header_select', $(CustomTabulator.TabulatorObj.element.closest(tableContainer)))[0]).append(rec_col_header_dd);
        // <editor-fold defaultstate="collapsed" desc=" btn: clear ">
        //#region -btn: clear
        let $el_clearFilter = $(
            `<button class="btn_restFilter_recoder btn form-control form-control-sm border w-25 p-1" disabled type="button"><i class="far fa-redo"></i></button>`
        ).on('click', (e) => {
            console.log('Clear', CustomTabulator.TabulatorObj.getFilters());

            iBS_hideAll_Dropdowns(); // must be BEFOE  setFilter and clearFilter
            /*
                CustomTabulator.TabulatorObj.setFilter(); 
//                CustomTabulator.TabulatorObj.clearFilter(); 
//                CustomTabulator.TabulatorObj.removeFilter("rec_name"); 
            */
            var filters = CustomTabulator.TabulatorObj.getFilters()[0]?.filter(function (item) {
                return item.field !== 'rec_name';
            });
            CustomTabulator.TabulatorObj.replaceData(settings_data);
            CustomTabulator.TabulatorObj.setFilter([filters]);

            $(e.target).closest('.btn_restFilter_recoder').prop('disabled', true);
        });
        $($('.rec_name_header_select', $(CustomTabulator.TabulatorObj.element.closest(tableContainer)))[0]).append($el_clearFilter);
        //#endregion
        // </editor-fold>

        //        $($(".rec_name_header_select", $(CustomTabulator.TabulatorObj.element.closest(tableContainer)))[0]).append(rec_col_header_dd);

        //#endregion
        // </editor-fold>

        let uniqueCameras = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.cam_name] = (acc[obj.cam_name] || 0) + 1;
            return acc;
        }, {});
        let uniqueCamerasArray = Object.entries(uniqueCameras).map(([cam_name, count]) => {
            return {
                field: cam_name,
                title: `${cam_name} (<span data-counter="${count}" class="selected">0</span>/${count})`,
                visible: true,
                dinm_dd_toCcheck: false,
            };
        });
        uniqueCamerasArray.sort((a, b) => a.field.localeCompare(b.field));

        const cam_name_col_header_dd = iGet_el_SelectDropdown({
            el_w: { class: 'move_ddown_to_body d-inline' },
            calling_btn: {
                class: 'form-control form-control-sm border w-75 py-1',
                _style: 'border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;',
                icon: { class: 'fa-line-columns fa-filter' },
                alt_el: `<span class="pe-2">Filter by</span>`,
            },
            dd_element: { class: 'iTr_F_01', style: 'width:450px; height:400px' },
            dd_title: { text: 'Select recorders' },
            dd_filter: { input: { placeholder: 'Search recorder...' } },
            //            dd_select_all:{ text:{ched:"Show all", clear:"n/a"} },
            dd_select_all: { class: 'd-none' },
            dd_select_list: { data: uniqueCamerasArray, exludeBy: 'src', style: 'width:440px; height:100%; overflow-y:auto;' },
            TabulatorObj: CustomTabulator.TabulatorObj,
            // <editor-fold defaultstate="collapsed" desc=" fn_onSelectAllChange - n/a we do not show this button ">
            //#region -fn_onSelectAllChange - n/a we do not show this button
            fn_onSelectAllChange: (e, ops) => {
                ops.TabulatorObj.setFilter();
                $('input.form-check-input', drop_down).prop('checked', 0);
                setTimeout(() => {
                    iBS_hideAll_Dropdowns();
                }, 250);
                // updating the select rows count(in label) for the select checkebox
                const counter_el = $(e.target).closest('.form-check').find('.selected');
                counter_el.empty().text(counter_el.attr('data-counter'));
            },
            //#endregion
            // </editor-fold>
            // <editor-fold defaultstate="collapsed" desc=" fn_onInptChkChange ">
            //#region -fn_onInptChkChange
            fn_onInptChkChange: (e, ops) => {
                let $dds_itemsList_w = $(e.target).closest('.dds_itemsList_w');
                let chs_selected = $('input.form-check-input:checked', $dds_itemsList_w).length > 0;

                $('button span', cam_name_col_header_dd).text(chs_selected ? 'Apply filter' : 'Filter by');
                $('.btn_restFilter_cam_name', $('button', cam_name_col_header_dd).closest('.cam_name_header_select')).prop(
                    'disabled',
                    !chs_selected
                );
            },
            //#endregion
            // </editor-fold>
            // <editor-fold defaultstate="collapsed" desc=" COMMENT: in case we want the on click to hide the table's rows ">
            //#region -in case we want the on click to hide the table's rows
            __fn_onInptChkChange: (e, ops) => {
                const search_val = $(e.target).attr('value');

                if ($(e.target).prop('checked')) {
                    ops.TabulatorObj.setFilter('rec_name', '=', search_val);
                    //                    setTimeout(()=>{
                    //                        iBS_hideAll_Dropdowns();
                    //                    },250);

                    //                    $(e.target).prop("checked", false);
                    //                    ops.TabulatorObj.getRows().map((row)=>{
                    //                        if(row.getData().rec_name != search_val){
                    //                            row.hide();
                    //                        }
                    //                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest('.form-check').find('.selected');
                    counter_el.empty().text(counter_el.attr('data-counter'));
                }
                //                else {
                //                    // console.log({col}, 'uncheck')
                //                    ops.TabulatorObj.getRows().map((row)=>{
                //                        if(row.getData().rec_name == search_val){
                //                            row.show();
                //                        }
                //                    });
                //                    // updating the select rows count(in label) for the select checkebox
                //                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                //                    counter_el.empty().text('0');
                //                }
            },
            //#endregion
            // </editor-fold>
            // <editor-fold defaultstate="collapsed" desc=" fn_onDropdown_shown ">
            //#region -fn_onDropdown_shown
            fn_onDropdown_shown: (e, ops) => {
                // <editor-fold defaultstate="collapsed" desc=" seeting the checked counters next to each checkbox ">
                //#region -seeting the checked counters next to each checkbox
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.rec_name] = (acc[obj.rec_name] || 0) + 1;
                    return acc;
                }, {});

                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', cam_name_col_header_dd).attr('id');
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input', drop_down).prop('checked', 0);
                $('.selected', drop_down).text('0');

                $.each(selected_counts, function (key, value) {
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr('id')}"]`).attr('id');
                    $('.selected', `label[for="${id}"]`).text(value);
                });
                //#endregion
                // </editor-fold>

                // <editor-fold defaultstate="collapsed" desc=" restoring the checked to the filter fields ">
                //#region -restoring the checked to the filter fields
                var filters = ops.TabulatorObj.getFilters();
                $.each(filters, function (index, innerArray) {
                    $.each(innerArray, function (i, filter) {
                        $(`input.form-check-input[value="${filter.value}"]`, drop_down).prop('checked', 1);
                    });
                });
                //#endregion
                // </editor-fold>

                return true;
            },
            //#endregion
            // </editor-fold>
            // <editor-fold defaultstate="collapsed" desc=" fn_onDropdown_hidden ">
            //#region -fn_onDropdown_hidden
            fn_onDropdown_hidden: (e, ops) => {
                console.log('hide');
                $('button span', cam_name_col_header_dd).text('Select');
                const dropdown_id = $('button', cam_name_col_header_dd).attr('id');
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');

                /* let filters = [];
                $("input.form-check-input:checked" ,drop_down).each(function(){               
                    filters.push({field:"rec_name", type:"=", value:$(this).val()});
                });
                
//                filters.push({field:"cam_info", type:"=", value:"Axis Q17"});
                
                ops.TabulatorObj.setFilter([filters]);
                */

                filter_tblData(CustomTabulator, drop_down, 'cam_name');

                return true;
            },
            //#endregion
            // </editor-fold>
        });
        $($('.cam_name_header_select', $(CustomTabulator.TabulatorObj.element.closest(tableContainer)))[0]).append(cam_name_col_header_dd);
        // <editor-fold defaultstate="collapsed" desc=" btn: clear ">
        //#region -btn: clear
        $el_clearFilter = $(
            `<button class="btn_restFilter_cam_name btn form-control form-control-sm border w-25 p-1" disabled type="button"><i class="far fa-redo"></i></button>`
        ).on('click', (e) => {
            console.log('Clear');

            iBS_hideAll_Dropdowns(); // must be BEFOE  setFilter and clearFilter
            /*
                CustomTabulator.TabulatorObj.setFilter(); 
                CustomTabulator.TabulatorObj.clearFilter(); 
            */
            var filters = CustomTabulator.TabulatorObj.getFilters()[0]?.filter(function (item) {
                return item.field !== 'cam_name';
            });
            CustomTabulator.TabulatorObj.replaceData(settings_data);
            CustomTabulator.TabulatorObj.setFilter([filters]);

            $(e.target).closest('.btn_restFilter_cam_name').prop('disabled', true);
        });
        $($('.cam_name_header_select', $(CustomTabulator.TabulatorObj.element.closest(tableContainer)))[0]).append($el_clearFilter);
        //#endregion
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc=" header filter rows button for: cam_info ">
        //#region -header filter rows button
        // dropdowns
        // recorder select dropdown for header
        let uniqueCamInfo = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.cam_info] = (acc[obj.cam_info] || 0) + 1;
            return acc;
        }, {});
        uniqueCamInfoArray = Object.entries(uniqueCamInfo).map(([cam_info, count]) => {
            return {
                field: cam_info,
                title: `${cam_info} (<span data-counter="${count}" class="selected">0</span>/${count})`,
                visible: true,
                dinm_dd_toCcheck: false,
            };
        });
        uniqueCamInfoArray.sort((a, b) => a.field.localeCompare(b.field));

        const cam_info_col_header_dd = iGet_el_SelectDropdown({
            el_w: { class: 'move_ddown_to_body d-inline' },
            calling_btn: {
                class: 'form-control form-control-sm border w-75 py-1',
                _style: 'border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;',
                icon: { class: 'fa-line-columns fa-filter' },
                alt_el: `<span class="pe-2">Select</span>`,
            },
            dd_element: { class: 'iTr_F_01', style: 'width:450px; height:400px' },
            dd_title: { text: 'Select recorders' },
            dd_filter: { input: { placeholder: 'Search recorder...' } },
            //            dd_select_all:{ text:{ched:"Show all", clear:"n/a"} },
            dd_select_all: { class: 'd-none' },
            dd_select_list: { data: uniqueCamInfoArray, exludeBy: 'src', style: 'width:440px; height:100%; overflow-y:auto;' },
            TabulatorObj: CustomTabulator.TabulatorObj,
            // <editor-fold defaultstate="collapsed" desc=" fn_onInptChkChange ">
            //#region -fn_onInptChkChange
            fn_onInptChkChange: (e, ops) => {
                let $dds_itemsList_w = $(e.target).closest('.dds_itemsList_w');
                let chs_selected = $('input.form-check-input:checked', $dds_itemsList_w).length > 0;

                $('button span', cam_info_col_header_dd).text(chs_selected ? 'Apply filter' : 'Select');
                $('.btn_restFilter_cam_info', $('button', cam_info_col_header_dd).closest('.cam_info_header_select')).prop(
                    'disabled',
                    !chs_selected
                );
            },
            //#endregion
            // </editor-fold>
            // <editor-fold defaultstate="collapsed" desc=" fn_onDropdown_shown ">
            //#region -fn_onDropdown_shown
            fn_onDropdown_shown: (e, ops) => {
                // <editor-fold defaultstate="collapsed" desc=" seeting the checked counters next to each checkbox ">
                //#region -seeting the checked counters next to each checkbox
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.cam_info] = (acc[obj.cam_info] || 0) + 1;
                    return acc;
                }, {});

                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', cam_info_col_header_dd).attr('id');
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input', drop_down).prop('checked', 0);
                $('.selected', drop_down).text('0');

                $.each(selected_counts, function (key, value) {
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr('id')}"]`).attr('id');
                    $('.selected', `label[for="${id}"]`).text(value);
                });
                //#endregion
                // </editor-fold>

                // <editor-fold defaultstate="collapsed" desc=" restoring the checked to the filter fields ">
                //#region -restoring the checked to the filter fields
                var filters = ops.TabulatorObj.getFilters();
                $.each(filters, function (index, innerArray) {
                    $.each(innerArray, function (i, filter) {
                        $(`input.form-check-input[value="${filter.value}"]`, drop_down).prop('checked', 1);
                    });
                });
                //#endregion
                // </editor-fold>

                return true;
            },
            //#endregion
            // </editor-fold>
            // <editor-fold defaultstate="collapsed" desc=" fn_onDropdown_hidden ">
            //#region -fn_onDropdown_hidden
            fn_onDropdown_hidden: (e, ops) => {
                console.log('hide');
                $('button span', cam_info_col_header_dd).text('Select');
                const dropdown_id = $('button', cam_info_col_header_dd).attr('id');
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');

                /* 
                let filters = CustomTabulator.TabulatorObj?.getFilters()[0] || [];
                $("input.form-check-input:checked" ,drop_down).each(function(){               
                    filters.push({field:"cam_info", type:"=", value:$(this).val()});
                });
                ops.TabulatorObj.setFilter([filters]);
                */

                //                let filters = [];
                // console.log({coder: filters})
                // let value
                // $("input.form-check-input:checked" ,drop_down).each(function(){
                //     filters.push({field:"cam_info", type:"=", value:$(this).val()});
                //     value = $(this).val()
                // });
                // const filter_tbl_data = CustomTabulator.currentPageData.filter((row)=>{
                //     if(row.cam_info == value){
                //         return true
                //     }
                // })
                // ops.TabulatorObj.setFilter([filters]);
                // console.log({filters, value})
                // CustomTabulator.TabulatorObj.setData(filter_tbl_data)
                // CustomTabulator.TabulatorObj.replaceData(filter_tbl_data)

                filter_tblData(CustomTabulator, drop_down, 'cam_info');

                return true;
            },
            //#endregion
            // </editor-fold>
        });
        $($('.cam_info_header_select', $(CustomTabulator.TabulatorObj.element.closest(tableContainer)))[0]).append(cam_info_col_header_dd);
        // <editor-fold defaultstate="collapsed" desc=" btn: clear ">
        //#region -btn: clear
        $el_clearFilter = $(
            `<button class="btn_restFilter_cam_info btn form-control form-control-sm border w-25 p-1" disabled type="button"><i class="far fa-redo"></i></button>`
        ).on('click', (e) => {
            console.log('Clear');

            iBS_hideAll_Dropdowns(); // must be BEFOE  setFilter and clearFilter
            /*
                CustomTabulator.TabulatorObj.setFilter(); 
                CustomTabulator.TabulatorObj.clearFilter(); 
            */
            var filters = CustomTabulator.TabulatorObj.getFilters()[0]?.filter(function (item) {
                return item.field !== 'cam_info';
            });
            CustomTabulator.TabulatorObj.replaceData(settings_data);
            CustomTabulator.TabulatorObj.setFilter([filters]);

            $(e.target).closest('.btn_restFilter_cam_info').prop('disabled', true);
        });
        $($('.cam_info_header_select', $(CustomTabulator.TabulatorObj.element.closest(tableContainer)))[0]).append($el_clearFilter);
        //#endregion
        // </editor-fold>

        //        $($(".rec_name_header_select", $(CustomTabulator.TabulatorObj.element.closest(tableContainer)))[0]).append(rec_col_header_dd);

        //#endregion
        // </editor-fold>
    });
    //#endregion
    // </editor-fold>
};
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" Temp 01 ">
//#region Itsik table-local

let getMuteData_to_iTr = () => {
    var _mapObj = {
        all: 'ALL',
        1: 'Blur',
        2: 'Tilt',
        3: 'Block',
        4: 'Camera liveness',
        6: 'Glare',
        7: 'Fault',
        8: 'Low light',
        21: 'Camera recordings',
    };
    let camInfo = {}; // required for mute functions

    const tableId = 'temp01_table';
    const tableContainer = `.${tableId}-container`;

    // Custom Sorter for mixed strings and numbers (like "CV 4.X Dev")
    /*
function customSorter(a, b, aRow, bRow, column, dir, sorterParams) {
    // Extract numbers and strings from each value
    const regex = /(\d+|\D+)/g;
    const aParts = a.match(regex) || [];
    const bParts = b.match(regex) || [];

    // Compare parts
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || "";  // Handle undefined
        const bPart = bParts[i] || "";

        // Check if the part is a number
        const aIsNum = !isNaN(aPart);
        const bIsNum = !isNaN(bPart);

        if (aIsNum && bIsNum) {
            // Both parts are numbers, compare them numerically
            const numDiff = parseFloat(aPart) - parseFloat(bPart);
            if (numDiff !== 0) return numDiff;
        } else {
            // Compare alphabetically if not a number
            const strDiff = aPart.localeCompare(bPart);
            if (strDiff !== 0) return strDiff;
        }
    }

    return 0;  // They are equal
}*/

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        // <editor-fold defaultstate="collapsed" desc=" basic FeaturedTable options ">
        //#region basic FeaturedTable options
        tableLocalStorageKey: tableId,
        tableContainer,
        _tbl_controlers: {
            TMPL_tbl_toolbars_f01: [
                { tbl_rowSel: { remove: 1 } },
                { __rowEditing: { remove: 1 } },
                { tblSearch: { c: 'me-2', input_w: 350 } },
                { tblColVisibility: { c: 'me-2' } },
                { tblExport: { c: 'me-2' } },
                { tblSettings: { c: '' } },
            ],
        },
        DefaultHiddenColumns: [], // To activate this option
        //#endregion
        // </editor-fold>
        TabulatorInitOptions: {
            // <editor-fold defaultstate="collapsed" desc=" basic Tabulator options ">
            //#region basic Tabulator options
            initialSort: [
                { column: 'rec_name', dir: 'asc' },
                { column: 'cam_name', dir: 'asc' },
            ],
            //            initialSort: [ { column: "cam_name", dir: "asc" }, { column: "rec_name", dir: "asc" } ],
            //            initialSort: [ { column: "rec_name", dir: "asc" } ],
            sortMode: 'local',
            filterMode: 'local',
            pagination: false,
            //            height: `${$('#pLeftNav').height() - 280}px`, // we do not yet have the real table position or the table header
            height: `780px`,
            printRowRange: 'all',

            keybindings: {
                scrollToStart: false, //disable navUp keybinding
                scrollToEnd: false, //disable navUp keybinding
            },
            //#endregion
            // </editor-fold>

            iTr_rowselectionChanged(row) {
                console.log(CustomTabulator.selectedRowsSet);
            },

            // <editor-fold defaultstate="collapsed" desc=" ajax and code for: new & save row ">
            //#region basic Tabulator options
            //            ajaxURL: 'controller_analysis',
            ajaxURL: 'php/iDBcode.php',
            data: mute_data,
            //            ajaxParams: function () {
            //                let params  = {
            //                    "callFor" : "createMute_camerasLst_iTr"
            //                };
            //                return params;
            //            },

            iTr_add_new_row_before: function (fieldData) {
                // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
                // fieldData.name = "New Data";
                return true;
            },
            iTr_add_new_row_after: function (fieldData) {},

            __iTr_row_save_before: function (FeaturedTable, ...fieldData) {
                // console.log('------------ iTr_row_save_before --------------');
                // console.log({ fieldData }, FeaturedTable);
                let $row = FeaturedTable.TabulatorObj.getSelectedRows()[0].getElement();
                $(':input.is-invalid:first', $row).focus();
                return $(':input.is-invalid', $row).length === 0;
            },

            __iTr_row_save_after: function (newData) {
                // console.log('------------ iTr_row_save_after --------------');
                let maps = newData.updates[0];

                _iGUiAJAX.doAJAXrequest({
                    url: 'contr_aCustData',
                    dataArr: { callFor: 'clients_save_iTr', recid: -1, data: maps },
                    fn_done: function (json) {
                        CustomTabulator.updateRowStatus();
                    },
                });
            },

            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region columnsObj
            columnsObj: function () {
                return [
                    {
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        frozen: true,
                        print: false,
                        download: false,
                        resizable: false,
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        visible: isColumnVisible.call(this, 'id'),
                        resizable: false,
                        frozen: true,
                        width: 60,
                        sorter: 'number',
                        iExcludeFromList: { cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: '',
                        field: 'ref_id',
                        visible: false,
                        iExcludeFromList: { src: 0, cv: 0 },
                    },
                    {
                        title: 'Recorder',
                        field: 'rec_name',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'rec_name'),
                        editable: this.isFieldEditable,
                        frozen: true,
                        width: 200,
                        sorter: 'string',
                        //                        sorter: customSorter,
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="rec_name_header_select"></div>`);
                            return div[0];
                        },
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Camera',
                        field: 'cam_name',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'cam_name'),
                        editable: this.isFieldEditable,
                        frozen: true,
                        width: 250,
                        sorter: 'string',
                        //                        sorter: customSorter,
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="camera_header_select"></div>`);
                            return div[0];
                        },
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Mute untill',
                        field: 'mute_untill',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'mute_untill'),
                        editable: this.isFieldEditable,
                        frozen: true,
                        width: 120,
                        sorter: 'string',
                        hozAlign: 'center',
                        headerFilter: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'What to mute',
                        field: 'mute_what',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'mute_what'),
                        editable: this.isFieldEditable,
                        frozen: true,
                        width: 400,
                        sorter: 'string',
                        headerFilter: 'input',
                        formatter: (cell, formatterParams, onRendered) => {
                            let mFor = [];
                            $(cell.getValue()?.split(',')).each(function () {
                                if (this !== '') {
                                    mFor.push(_mapObj[this]);
                                }
                            });
                            return mFor.join(', ');
                        },
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 50,
                        print: false,
                        download: false,
                        headerSort: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                ];
            },
            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -columnsObj
            iTr_rowFormatter_before: function (row) {
                //                console.log("------------ Table obj's rowFormatter Before ------------  ");
                return true;
            },
            iTr_rowFormatter_after: function (row) {
                //                console.log("------------ Table obj's rowFormatter After ------------  ");
            },
            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" exports ">
            //#region -exports
            printHeader: function () {
                return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
            },
            printFormatter: (tableHolder, table) => {
                $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                $(table).find('thead th').css({ 'font-size': '11px' });
                $(table).find('tbody td').css({ 'font-size': '12px' });
            },

            printFooter: function () {
                // Part of Print, will be the last printed line at the last page.
                const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');

                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                    <div class="d-flex gap-2">
                        <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                        <span class='fs-6'>${timeStamp} ****</span>
                    </div>
                </div>`;
            },
            //#endregion
            // </editor-fold>
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
        },
        //#endregion
        // </editor-fold>
    });

    // <editor-fold defaultstate="collapsed" desc=" on: tableBuilt ">
    //#region -on: tableBuilt
    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // do NOT use clone(true) as we want to define here the click function
        let $mute_for_btn = $('#mute_for')
            .clone()
            .removeAttr('id')
            .addClass('bypass_def_btn_style me-4') //; // .attr("id", "mute_for").removeClass("d-none");
            .on('click', () => {
                _CustomTabulator = CustomTabulator;
                camInfo['muteFor'] = null;
                mute_open_modal({ memo: '' });
            });
        $('.tbl_multy_purps_w', $(CustomTabulator['tableContainerElement'])).removeClass('align-content-end').append($mute_for_btn);

        // do NOT use clone(true) as we want to define here the click function
        let $unmute_for_btn = $('#setting_unmute')
            .clone()
            .removeAttr('id')
            .addClass('bypass_def_btn_style') //; //.attr("id", "mute_for").removeClass("d-none");
            .on('click', () => {
                _CustomTabulator = CustomTabulator;
                mute_unmute_DoIT('unmute');
            });
        $('.tbl_multy_purps_w', $(CustomTabulator['tableContainerElement'])).append($unmute_for_btn);

        // dropdowns
        // recorder select dropdown for header
        let uniqueRecordars = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.rec_name] = (acc[obj.rec_name] || 0) + 1;
            return acc;
        }, {});
        let uniqueRecordarsArray = Object.entries(uniqueRecordars).map(([rec_name, count]) => {
            return {
                field: rec_name,
                title: `${rec_name} (<span data-counter="${count}" class="selected">0</span>/${count})`,
                visible: true,
                dinm_dd_toCcheck: false,
            };
        });
        uniqueRecordarsArray.sort((a, b) => a.field.localeCompare(b.field));
        const rec_col_header_dd = iGet_el_SelectDropdown({
            el_w: { class: 'move_ddown_to_body' },
            calling_btn: {
                class: 'form-control form-control-sm border py-1',
                _style: 'border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;',
                icon: { class: 'fa-line-columns fa-filter' },
                alt_el: `<span class="pe-2">Select</span>`,
            },
            dd_element: { class: 'iTr_F_01' },
            dd_title: { text: 'Select recorders' },
            dd_filter: { input: { placeholder: 'Search recorder...' } },
            dd_select_all: { class: 'd-none' },
            dd_select_list: { data: uniqueRecordarsArray, exludeBy: 'src' },
            TabulatorObj: CustomTabulator.TabulatorObj,
            fn_onInptChkChange: (e, ops) => {
                const location_nm = $(e.target).attr('value');

                //                let $filterByValue_el = $(".filterByValue", $(e.target).closest(".dropdown-menu"));
                //                $filterByValue_el.attr("p_val", $("input", $filterByValue_el).val());

                if ($(e.target).prop('checked')) {
                    ops.TabulatorObj.getRows().map((row) => {
                        if (row.getData().rec_name == location_nm) {
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest('.form-check').find('.selected');
                    counter_el.empty().text(counter_el.attr('data-counter'));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row) => {
                        if (row.getData().rec_name == location_nm) {
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row, false, true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest('.form-check').find('.selected');
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops) => {
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.rec_name] = (acc[obj.rec_name] || 0) + 1;
                    return acc;
                }, {});

                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', rec_col_header_dd).attr('id');
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

        // camera select dropdown for header
        let uniqueCameras = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.cam_name] = (acc[obj.cam_name] || 0) + 1;
            return acc;
        }, {});
        let uniqueCamerasArray = Object.entries(uniqueCameras).map(([cam_name, count]) => {
            return {
                field: cam_name,
                title: `${cam_name} (<span data-counter="${count}" class="selected">0</span>/${count})`,
                visible: true,
                dinm_dd_toCcheck: false,
            };
        });
        uniqueCamerasArray.sort((a, b) => a.field.localeCompare(b.field));
        const camera_col_header_dd = iGet_el_SelectDropdown({
            el_w: { class: 'move_ddown_to_body' },
            calling_btn: {
                class: 'form-control form-control-sm border py-1',
                _style: 'border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;',
                icon: { class: 'fa-line-columns fa-filter' },
                alt_el: `<span class="pe-2">Select</span>`,
            },
            dd_element: { class: 'iTr_F_01', style: 'width:360px;height:300px;overflow:hidden;' },
            dd_title: { text: 'Select recorders' },
            dd_filter: { input: { placeholder: 'Search recorder...' }, 'rest_filter_input_on-dd_exit': false },
            dd_select_all: { class: 'd-none' },
            dd_select_list: { data: uniqueCamerasArray, exludeBy: 'src', style: 'width:350px; height:100%; overflow-y:auto;' },
            TabulatorObj: CustomTabulator.TabulatorObj,
            fn_onInptChkChange: (e, ops) => {
                const location_nm = $(e.target).attr('value');

                //                let $filterByValue_el = $(".filterByValue", $(e.target).closest(".dropdown-menu"));
                //                $filterByValue_el.attr("p_val", $("input", $filterByValue_el).val());
                //                $(".filterByValue input", $ddownWin_el)
                if ($(e.target).prop('checked')) {
                    ops.TabulatorObj.getRows().map((row) => {
                        if (row.getData().cam_name == location_nm) {
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest('.form-check').find('.selected');
                    counter_el.empty().text(counter_el.attr('data-counter'));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row) => {
                        if (row.getData().cam_name == location_nm) {
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row, false, true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest('.form-check').find('.selected');
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops) => {
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.cam_name] = (acc[obj.cam_name] || 0) + 1;
                    return acc;
                }, {});

                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', rec_col_header_dd).attr('id');
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

        // appending the dropdowns
        $($('.rec_name_header_select', $(CustomTabulator.TabulatorObj.element.closest(tableContainer)))[0]).append(rec_col_header_dd);
        $($('.camera_header_select', $(CustomTabulator.TabulatorObj.element.closest(tableContainer)))[0]).append(camera_col_header_dd);
    });
    //#endregion
    // </editor-fold>

    window.tempTable = CustomTabulator; // +info+ adding to global object to access it from developer tools and anywhere else in the code for debugging
};
//#endregion
// </editor-fold>
// <editor-fold defaultstate="collapsed" desc=" fn: expandRowWithNestedTable_Jinput_Level1 ">
//#region -fn: expandRowWithNestedTable_Level1
function expandRowWithNestedTable_Jinput_Level1(e, row) {
    // increase the height of the table row is expanded
    const expand_row_def = row.getCell('rowExpand').getColumn().getDefinition();
    expand_row_def.increaseTblHeight?.(row);

    let btn = $(e.target).closest('button');
    $(btn).data('expanded', true).removeClass('btn-success').addClass('btn-danger');
    $('i', btn).removeClass('fa-plus').addClass('fa-minus');

    //    $(e.target).data('expanded', true);
    //    $(e.target).html('-');
    //    $(e.target).removeClass('bg-primary');
    //    $(e.target).addClass('bg-danger');

    // <button type="button" class="btnExpand btn btn-sm m-0 p-0 btn-danger"><i class="fas px-1 fa-minus"></i></button>
    // <button type="button" class="expand-btn btn btn-sm btn-success m-0 p-0"><i class="fas fa-plus px-1"></i></button>

    // <editor-fold defaultstate="collapsed" desc=" table's Data ">
    //#region -table's Data
    const tableId = row.getTable().element.id + `-nested-table-${row.getData().id}`;
    const tableContainer = `${tableId}-container`;

    // Add class to row element at the level
    $(row.getElement()).addClass('row-expanded-lvl-1');
    // <div class='${tableContainer} table-container p-2 itr-tbl-nested-1' style='width: ${$(row.getElement()).closest(".itsik-table-container").width()}px' >
    // console.log({styling: $(row.getElement()).width()}, $(row.getElement()).closest(".itsik-table-container").width())
    console.log({ width: 10 }, $(row.getElement()).closest('.tabulator-tableholder').width());
    $(row.getElement()).append(`
        <div class='${tableContainer} table-container p-2 itr-tbl-nested-1' style='width: ${
        $(row.getElement()).closest('.tabulator-tableholder').width() - 22
    }px' >
                <div class="table-header-toolbar_w px-2"></div>
                <div id="${tableId}" class="nested-table"></div>
            </div>`);

    // resize table width when it is resized
    iTr_listen_resize(row);

    let paddress = row.getData()['data-pAddress'];
    var filteredData = camHLateset.filter(function (item) {
        return item['data-pAddress'] === paddress;
    });

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer: '.' + tableContainer,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        tbl_toolbar: {
            tmpl_name: 'editMultiP_sColVExp',
            axns: {
                edit_remove: ['.duplicate-row-btn', '.delete-row-btn'],
                el_w: '#TMPLs_iTr_health_sets',
                multi_select: { els: ['.health-set_Lmain-multi_select'] },
                multi_purps: { els: ['.health-set_Lmain_multiP'] },
            },
        },
        TabulatorInitOptions: {
            data: filteredData,
            //            ajaxURL: 'php/iDBcode.php',
            sortMode: 'local',
            filterMode: 'local',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            maxHeight: '500px',
            minHeight: '250px',
            height: 'unset',

            //           ajaxParams: function () {
            //               let params  = {
            //                   "recBY_fixedVal" : row.getData()[expand_row_def["expandToKeyData"]], // where fixedData = "female"  and defined once we expending a row from extandToDate
            //               };
            //               return params;
            //           },

            columnsObj: function () {
                // adding all other column configurations
                return [
                    {
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        frozen: true,
                        print: false,
                        download: false,
                        resizable: false,
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        visible: isColumnVisible.call(this, 'id'),
                        resizable: false,
                        frozen: true,
                        width: 60,
                        sorter: 'number',
                        iExcludeFromList: { cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: '',
                        field: 'btns',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'clientName'),
                        editable: this.isFieldEditable,
                        frozen: true,
                        width: 150,
                        sorter: 'string',
                        headerFilter: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Client',
                        field: 'clientName',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'clientName'),
                        editable: this.isFieldEditable,
                        frozen: true,
                        width: 150,
                        sorter: 'string',
                        headerFilter: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Date',
                        field: 'date',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'dat'),
                        editable: this.isFieldEditable,
                        width: 140,
                        sorter: 'datetime',
                        headerFilter: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Device name',
                        field: 'deviceN',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'deviceN'),
                        editable: this.isFieldEditable,
                        width: 200,
                        sorter: 'string',
                        headerFilter: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Problem',
                        field: 'status',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'deviceN'),
                        editable: this.isFieldEditable,
                        width: 200,
                        sorter: 'string',
                        headerFilter: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'Image Quality',
                        field: 'viewAI',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'deviceN'),
                        editable: this.isFieldEditable,
                        width: 150,
                        sorter: 'string',
                        headerFilter: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'IP',
                        field: 'ip',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'deviceN'),
                        editable: this.isFieldEditable,
                        width: 150,
                        sorter: 'string',
                        headerFilter: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: 'filter by',
                        field: 'dt_filter',
                        validator: 'required',
                        visible: isColumnVisible.call(this, 'dt_filter'),
                        editable: this.isFieldEditable,
                        width: 150,
                        sorter: 'string',
                        headerFilter: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 50,
                        print: false,
                        download: false,
                        headerSort: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                ];
            },
        },
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
        },
    });

    CustomTabulator.TabulatorObj.on('dataLoading', () => {
        // scroll the row into view
        expand_row_def.scrollRowTblAfterLoad?.(row);
    });

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);

        // adding the dropdowns as table column names
        CustomTabulator.uniqueSelectDropdowns.headerFilters = {
            location: null, // later we will store the dropdown element reference
            gender: null,
        };

        /*
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Location dropdown ">
        //#region -for header filter in table - Location dropdown
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(dropdown);

        //#endregion
                // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Gender dropdown ">
        //#region -for header filter in table - gender dropdown
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(genderDropdown);

        //#endregion
        // </editor-fold>
        */
    });
    //#endregion
    // </editor-fold>
}
//#endregion
// </editor-fold>

$('body').on('click', function (e) {
    hidePopDropdowns(e.target);
    /*
    iConsole("i am coding", e.target)
    // aria-describedby
    $('.popover.show').each(function () {

        // if($(this).attr('id') != )
        // hide any open popovers when the anywhere else in the body is clicked
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });*/
});

function hidePopDropdowns(_this) {
    iConsole(_this);
    // console.log({element: _this})
    if ($(_this).prop('tagName').toLowerCase() === 'i') {
        _this = $(_this).closest('button');
    }

    if ($(_this).hasClass('dropdown-toggle')) {
        return;
    }

    iBS_hideAll_Dropdowns();
    iBS_hideAll_Popovers();

    /*
    $.each($(".popover.show"), function(inx, el){
        iConsole(el[0], _this[0]);
        if($(el).attr("id") !== $(_this).attr("aria-describedby")){
            $(el).remove();
        }
    });
    
//    data-bs-toggle="dropdown"
    $.each($(".dropdown-menu.show"), function(inx, el){
//        if($(el).siblings ) 
        $(".dropdown-menu.show").removeClass("show");
    });
            
    */
}

/* document.addEventListener('click', function (event) {
    // Check if the click is outside any popover trigger or popover itself
    // if (!event.target.closest('.popover') && !event.target.closest('[data-bs-toggle="popover"]')) {
    //     const popoverTriggerList = [].slice.call($('.popover.show'));
    //     console.log({popoverTriggerList}, document.querySelectorAll('.popover'))
    //     const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    //         return popoverTriggerEl;
    //     });
    //     popoverList.forEach(function (popover) {
    //         console.log({click:"click"})
    //         $(popover).hide();
    //     });
    // }
});  */

function iTr_listen_resize(row) {
    $(window).resize(() => {
        $('.table-container', row.getElement()).attr(
            'style',
            `width: ${$(row.getElement()).closest('.tabulator-tableholder').width() - 22}px`
        );
    });
}

// <editor-fold defaultstate="collapsed" desc="multi_tbl-1">
//#region multi_tbl-1
let multi_tbl_1 = () => {
    const tableId = 'multi-table-1';
    const tableContainer = '.multi-table-1-container';

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        tbl_toolbar: {
            tmpl_name: 'editMultiP_sColVExp',
            axns: {
                edit_remove: ['.duplicate-row-btn', '.delete-row-btn'],
                el_w: '#TMPLs_iTr_health_sets',
                multi_select: { els: ['.health-set_Lmain-multi_select'] },
                multi_purps: { els: ['.health-set_Lmain_multiP'] },
            },
        },
        TabulatorInitOptions: {
            ajaxURL: 'php/iDBcode.php',
            // ajaxURL: 'https://dev1a.ai-rgus.com/php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php',
            rowHeight: 40,

            iTr_showSortingBadgeNumber: false,
            sortMode: 'local',
            filterMode: 'local',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            pagination: false,
            height: `${$('.table_w').height() - 250}px`, // we do not yet have the real table position or the table header element

            //  We do not use this option as it create other issue. We manage these thing ourself by creating custom checkbox and it's state
            //            selectableRows:true,
            //                rowHeader: {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
            //                    rowRange:"active" //only toggle the values of the active filtered rows
            //                }, hozAlign:"center", headerSort:false},

            // iTr_ajaxResponse: function (url, params, response) {
            //     //                iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
            //     return response['dtRows'];
            // },

            iTr_add_new_row_before: function (fieldData) {
                // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
                fieldData.chbox = 1;
                fieldData.chbox2 = 0;
                fieldData.name = 'New Data';
                return true;
            },
            iTr_add_new_row_after: function (fieldData) {},

            iTr_row_save_before: function (TabulatorObj, ...fieldData) {
                iConsole('------------ iTr_row_save_before --------------');
                iConsole({ fieldData }, TabulatorObj);
                return true;
            },

            iTr_row_save_after: function (newData) {
                $.ajax({
                    method: 'POST',
                    url: 'php/update-user.php',
                    dataType: 'json',
                    headers: {
                        csrftoken: _userStr,
                    },
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(newData),
                }).done((res) => {
                    if (res.success == 1) {
                        CustomTabulator.updateRowStatus();
                    } else {
                        alert(res.data?.error || 'Something went wrong');
                    }
                });
            },

            printHeader: function () {
                return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
            },
            printFooter: function () {
                const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');

                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                <div class="d-flex gap-2">
                    <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                    <span class='fs-6'>${timeStamp}</span>
                </div>
            </div>`;
            },
            printFormatter: (tableHolder, table) => {
                $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                $(table).find('thead th').css({ 'font-size': '11px' });
                $(table).find('tbody td').css({ 'font-size': '12px' });
            },
            printRowRange: 'all',

            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region columnsObj
            columnsObj: function () {
                return [
                    {
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: '',
                        field: 'rowExpand',
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                        expandToKeyData: 'gender',

                        formatter: function (cell, formatterParams, onRendered) {
                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered, expandRowWithNestedTable_Level1);
                            return el;
                        },
                        increaseTblHeight: function (row) {
                            $(CustomTabulator.TabulatorObj.element).attr('style', 'height:1100px !important');
                        },
                        scrollRowTblAfterLoad: function (row) {
                            // row.getElement().scrollIntoView({block:"end"});
                            CustomTabulator.TabulatorObj.scrollToRow(row, 'top', false);

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                        },
                    },
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,

                        titleFormatterParams: {
                            rowRange: 'active', //only toggle the values of the active filtered rows
                        },
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: { cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
                        //                        field_1: 'isCurrentRow',
                        //                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function () {
                                success($(this).val());
                            });

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        iExcludeFromList: { src: 0 },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'browsers');
                                $(input).prop('name', 'browser');
                                $(input).prop('id', 'browser');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="browsers">
                                        <option value="Edge">
                                        <option value="Firefox">
                                        <option value="Chrome">
                                        <option value="Opera">
                                        <option value="Safari">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,
                        //
                        cellMouseEnter: function (event, cell) {
                            CustomTabulator.iTr_zoom_or_edit({}, 'MouseEnter', event, cell);
                        },
                        //                         cellMouseLeave: function (event, cell) {
                        //                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
                        //                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit(
                                { popo_z: { class: 'mb-0 close_on_scroll', style: 'background-color: #e7e7e9;' } },
                                'DblClick',
                                event,
                                cell
                            );
                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter: 'input',
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: false,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="location_header_select"></div>`);
                            return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="gender_header_select"></div>`);
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'gender-list');
                                $(input).prop('name', 'gender');
                                $(input).prop('id', 'gender');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 350,
                        print: false,
                        download: false,
                        headerSort: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                ];
            },
            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -iTr_rowFormatter_ before|after
            iTr_rowFormatter_before: function (row) {
                //                iConsole("------------ Table obj's rowFormatter Before ------------  ");

                var data = row.getData();
                //                if(data.isCurrentRow?.edit_mode || data.isCurrentRow?.edit_mode)
                $(row.getElement()).attr('data-location', data.location);

                if (data.location == 'India') {
                    row.getCell('location').getElement().style.color = 'blue';
                }
                if (data.location == 'China') {
                    $(row.getElement()).addClass('china');

                    // add custom html to the cell
                    row.getCell('location').getElement().innerHTML = `<a href='google.com'>${data.location}</a>`;
                }

                if (row.getData().isCurrentRow?.edit_mode) {
                    $(row.getElement()).removeClass('china');
                }

                return true;
            },
            iTr_rowFormatter_after: function (row) {
                //                iConsole("------------ Table obj's rowFormatter After ------------  ");
            },
            //#endregion
            // </editor-fold>
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
        },
        //#endregion
        // </editor-fold>
    });
    window.tempTable = CustomTabulator; // +info+ adding to global object to access it from developer tools and anywhere else in the code for debugging

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);

        // adding the dropdowns as table column names
        CustomTabulator.uniqueSelectDropdowns.headerFilters = {
            location: null, // later we will store the dropdown element reference
            gender: null,
        };

        /*
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Location dropdown ">
        //#region -for header filter in table - Location dropdown
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

//                let $filterByValue_el = $(".filterByValue", $(e.target).closest(".dropdown-menu"));
//                $filterByValue_el.attr("p_val", $("input", $filterByValue_el).val());

 
                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".multi-table-1-container")))[0]).append(dropdown);

        //#endregion
                // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Gender dropdown ">
        //#region -for header filter in table - gender dropdown
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

//                let $filterByValue_el = $(".filterByValue", $(e.target).closest(".dropdown-menu"));
//                $filterByValue_el.attr("p_val", $("input", $filterByValue_el).val());

 
                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".multi-table-1-container")))[0]).append(genderDropdown);

        //#endregion
        // </editor-fold>
        */
    });
};
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="multi_tbl-2">
//#region multi_tbl-1
let multi_tbl_2 = () => {
    const tableId = 'multi-table-2';
    const tableContainer = '.multi-table-2-container';

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        tbl_toolbar: {
            tmpl_name: 'editMultiP_sColVExp',
            axns: {
                edit_remove: ['.duplicate-row-btn', '.delete-row-btn'],
                el_w: '#TMPLs_iTr_health_sets',
                multi_select: { els: ['.health-set_Lmain-multi_select'] },
                multi_purps: { els: ['.health-set_Lmain_multiP'] },
            },
        },
        TabulatorInitOptions: {
            ajaxURL: 'php/iDBcode.php',
            // ajaxURL: 'https://dev1a.ai-rgus.com/php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php',
            rowHeight: 40,

            sortMode: 'local',
            filterMode: 'local',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            pagination: false,
            height: `${$('.table_w').height() - 250}px`, // we do not yet have the real table position or the table header element

            //  We do not use this option as it create other issue. We manage these thing ourself by creating custom checkbox and it's state
            //            selectableRows:true,
            //                rowHeader: {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
            //                    rowRange:"active" //only toggle the values of the active filtered rows
            //                }, hozAlign:"center", headerSort:false},

            // iTr_ajaxResponse: function (url, params, response) {
            //     //                iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
            //     return response['dtRows'];
            // },

            iTr_add_new_row_before: function (fieldData) {
                // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
                fieldData.chbox = 1;
                fieldData.chbox2 = 0;
                fieldData.name = 'New Data';
                return true;
            },
            iTr_add_new_row_after: function (fieldData) {},

            iTr_row_save_before: function (TabulatorObj, ...fieldData) {
                iConsole('------------ iTr_row_save_before --------------');
                iConsole({ fieldData }, TabulatorObj);
                return true;
            },

            iTr_row_save_after: function (newData) {
                $.ajax({
                    method: 'POST',
                    url: 'php/update-user.php',
                    dataType: 'json',
                    headers: {
                        csrftoken: _userStr,
                    },
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(newData),
                }).done((res) => {
                    if (res.success == 1) {
                        CustomTabulator.updateRowStatus();
                    } else {
                        alert(res.data?.error || 'Something went wrong');
                    }
                });
            },

            printHeader: function () {
                return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
            },
            printFooter: function () {
                const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');

                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                <div class="d-flex gap-2">
                    <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                    <span class='fs-6'>${timeStamp}</span>
                </div>
            </div>`;
            },
            printFormatter: (tableHolder, table) => {
                $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                $(table).find('thead th').css({ 'font-size': '11px' });
                $(table).find('tbody td').css({ 'font-size': '12px' });
            },
            printRowRange: 'all',

            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region columnsObj
            columnsObj: function () {
                return [
                    {
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: '',
                        field: 'rowExpand',
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                        expandToKeyData: 'gender',

                        formatter: function (cell, formatterParams, onRendered) {
                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered, expandRowWithNestedTable_Level1);
                            return el;
                        },
                        increaseTblHeight: function (row) {
                            $(CustomTabulator.TabulatorObj.element).attr('style', 'height:1100px !important');
                        },
                        scrollRowTblAfterLoad: function (row) {
                            // row.getElement().scrollIntoView({block:"end"});
                            CustomTabulator.TabulatorObj.scrollToRow(row, 'top', false);

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                        },
                    },
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,

                        titleFormatterParams: {
                            rowRange: 'active', //only toggle the values of the active filtered rows
                        },
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: { cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
                        //                        field_1: 'isCurrentRow',
                        //                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function () {
                                success($(this).val());
                            });

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        iExcludeFromList: { src: 0 },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'browsers');
                                $(input).prop('name', 'browser');
                                $(input).prop('id', 'browser');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="browsers">
                                        <option value="Edge">
                                        <option value="Firefox">
                                        <option value="Chrome">
                                        <option value="Opera">
                                        <option value="Safari">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,
                        //
                        cellMouseEnter: function (event, cell) {
                            CustomTabulator.iTr_zoom_or_edit({}, 'MouseEnter', event, cell);
                        },
                        //                         cellMouseLeave: function (event, cell) {
                        //                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
                        //                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit(
                                { popo_z: { class: 'mb-0 close_on_scroll', style: 'background-color: #e7e7e9;' } },
                                'DblClick',
                                event,
                                cell
                            );
                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter: 'input',
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: false,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="location_header_select"></div>`);
                            return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="gender_header_select"></div>`);
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'gender-list');
                                $(input).prop('name', 'gender');
                                $(input).prop('id', 'gender');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 350,
                        print: false,
                        download: false,
                        headerSort: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                ];
            },
            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -iTr_rowFormatter_ before|after
            iTr_rowFormatter_before: function (row) {
                //                iConsole("------------ Table obj's rowFormatter Before ------------  ");

                var data = row.getData();
                //                if(data.isCurrentRow?.edit_mode || data.isCurrentRow?.edit_mode)
                $(row.getElement()).attr('data-location', data.location);

                if (data.location == 'India') {
                    row.getCell('location').getElement().style.color = 'blue';
                }
                if (data.location == 'China') {
                    $(row.getElement()).addClass('china');

                    // add custom html to the cell
                    row.getCell('location').getElement().innerHTML = `<a href='google.com'>${data.location}</a>`;
                }

                if (row.getData().isCurrentRow?.edit_mode) {
                    $(row.getElement()).removeClass('china');
                }

                return true;
            },
            iTr_rowFormatter_after: function (row) {
                //                iConsole("------------ Table obj's rowFormatter After ------------  ");
            },
            //#endregion
            // </editor-fold>
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
        },
        //#endregion
        // </editor-fold>
    });
    window.tempTable = CustomTabulator; // +info+ adding to global object to access it from developer tools and anywhere else in the code for debugging

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);

        // adding the dropdowns as table column names
        CustomTabulator.uniqueSelectDropdowns.headerFilters = {
            location: null, // later we will store the dropdown element reference
            gender: null,
        };

        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        /*
        // -- for header filter in table - Location dropdown --
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

//                let $filterByValue_el = $(".filterByValue", $(e.target).closest(".dropdown-menu"));
//                $filterByValue_el.attr("p_val", $("input", $filterByValue_el).val());

 
                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".multi-table-2-container")))[0]).append(dropdown);

        // -- for header filter in table - Gender dropdown --
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

//                let $filterByValue_el = $(".filterByValue", $(e.target).closest(".dropdown-menu"));
//                $filterByValue_el.attr("p_val", $("input", $filterByValue_el).val());

 
                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.select();
                            CustomTabulator.selectRowAndCheckInput(row);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            // row.deselect();
                            CustomTabulator.selectRowAndCheckInput(row,false,true);
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".multi-table-2-container")))[0]).append(genderDropdown);
        */
        // </editor-fold>
    });
};
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" copy_paste_local_loading ">
//#region copy_paste_local_loading
let copy_paste_local_loading = () => {
    const tableId = 'copy-paste-table';
    const tableContainer = '.copy-paste-table-container';

    const processTableData = async () => {
        let alldata = CustomTabulator.TabulatorObj.getData();
        const seenDealNames = new Set();
        $('#deals_submitIssue').addClass('d-none');
        $('#noData_submitIssue').addClass('d-none');
        //check if user is enabled
        const add_userID = $('#allowEnterUserID', tableContainer).is(':checked');
        let formattedData = alldata
            .map((rowData, index) => {
                const item = {};

                // fetching visible column
                CustomTabulator.TabulatorObj.getColumns()
                    .filter((col) => col.isVisible() && col.getField() && col.getField() !== 'status' && col.getField() !== 'delete_row')
                    .forEach((col) => {
                        item[col.getField()] = rowData[col.getField()];
                    });

                if (Object.values(item).every((value) => value === undefined || value === '' || value === null)) {
                    return { isEmpty: true };
                }

                let dealName = (item.website + item.location).toLowerCase();

                // Check if any value in the item is null or undefined
                const isValueMissing = Object.values(item).some((dt) => dt === null || dt === undefined);

                if (isValueMissing) {
                    item.status = `<div class="alert alert-danger fw-bold border-danger border-w2 mb-0 py-0">
                            <i class="fas fa-check pe-2"></i> Row Data Missing</div>`;
                    item.notValid = true;
                }

                if (seenDealNames.has(dealName)) {
                    item.status = `<div class="alert alert-warning fw-bold border-warning border-w2 mb-0 py-0">
                            <i class="fas fa-exclamation-triangle pe-2"></i>Duplicate Deal Name</div>`;
                    item.notValid = true;
                } else {
                    seenDealNames.add(dealName);
                }
                return item;
            })
            .filter((dt) => !dt.isEmpty)
            .sort((a, b) => {
                const getPriority = (entry) => {
                    if (!entry.status) return 3; // No status = lowest priority
                    if (entry.status.includes('alert-danger')) return 0; // Highest priority
                    if (entry.status.includes('alert-warning')) return 1;
                    return 2; // Other statuses
                };

                return getPriority(a) - getPriority(b);
            });
        if (formattedData.length === 0) {
            $('#noData_submitIssue').removeClass('d-none');
            return;
        }
        CustomTabulator.TabulatorObj.replaceData(formattedData);
        // CustomTabulator.TabulatorObj.setSort('status', "desc");
        if (formattedData.find((dt) => dt.notValid)) {
            $('#deals_submitIssue').removeClass('d-none');
            return;
        }

        $('#deals_probSaveDate').addClass('d-none');
        //        let deals_data = $("#dealsImporter").val().replaceAll("\n", "[{n}]");
        //        deals_data = deals_data.split('').join('_-_');

        const fields = ['website', 'company_name', 'location'];
        if (add_userID) {
            fields.push('UID');
        }

        deals_data = formattedData
            .map((item, index) => {
                const transformed = fields.map((field) => item[field]).join('\t');

                return transformed;
            })
            .join('[{n}]');
        deals_data = deals_data.split('').join('_-_');

        _iGUiAJAX.doAJAXrequest({
            url: 'contr_sales',
            dataArr: { callFor: 'newDeals_import', deals_data: deals_data, addUserID: add_userID },
            fn_done: function (json) {
                if (json['savedOK']) {
                    json.dOut.forEach((row) => {
                        const dealName = row.dealName;
                        const foundedRow = formattedData.find((dt) => {
                            let cdealName = dt.website + ' ' + dt.location;
                            if (cdealName.toLowerCase() === dealName.toLowerCase()) {
                                return true;
                            }
                        });
                        if (foundedRow) {
                            foundedRow.status = row.status;
                        }
                    });

                    // Handle the response from the PHP script
                    CustomTabulator.TabulatorObj.replaceData(formattedData);
                    $('.submit-copy-paste', tableContainer)
                        .removeClass('btn-outline-primary')
                        .addClass('btn-outline-secondary')
                        .prop('disabled', true);
                } else {
                    $('#deals_probSaveDate').removeClass('d-none'); // +IR place it correct
                }
            },
        });
    };

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,

        TabulatorInitOptions: {
            height: `${$('.table_w').height() - 189}px`,
            data: [{}],
            iTr_clipboard_copy_after: function (new_rows) {
                console.log(new_rows);
                // new_rows[0].getData()["name"]
                // new_rows[0].getCell("name").getElement()
                // we nee dupload button with access to teh tabolator object and a loop over the data
            },
            iTr_on_upload_row_btn_click: function () {
                console.log(CustomTabulator.TabulatorObj.getData());
            },
            rowFormatter: function (row) {
                row.getElement().classList.remove('tabulator-row-odd');
            },
            selectableRange: 1,
            // selectableRangeColumns: true,
            selectableRangeRows: true,
            selectableRangeClearCells: true,
            editTriggerEvent: 'dblclick',
            clipboard: true,
            clipboardCopyStyled: false,
            clipboardCopyConfig: {
                rowHeaders: false,
                columnHeaders: false,
            },
            clipboardPasteAction: (data) => {
                let alldata = [...data, ...CustomTabulator.TabulatorObj.getData()];
                CustomTabulator.TabulatorObj.replaceData(alldata);
            },
            clipboardPasteParser: function (clipboardData) {
                const columnFields = this.table
                    .getColumns()
                    .filter((col) => col.isVisible() && col.getField() && col.getField() !== 'status' && col.getField() !== 'delete_row')
                    .map((col) => col.getField());
                // Split clipboard text into rows and columns
                const rows = clipboardData
                    .trim()
                    .split('\n')
                    .map((row) => row.split('\t'));

                // Filter out empty rows (rows where all cells are empty)
                const filteredRows = rows.filter((row) => row.some((cell) => cell.trim() !== ''));

                // Map each row to an object keyed by your columnFields
                const dataObjects = filteredRows.map((row) => {
                    let obj = {};
                    columnFields.forEach((field, index) => {
                        obj[field] = row[index] ? row[index].trim() : null;
                    });
                    obj.dealName = `${obj.company_name} ${obj.location}`;
                    return obj;
                });

                return dataObjects;
            },
            clipboardCopyRowRange: 'range',
            rowHeader: {
                resizable: false,
                frozen: true,
                width: 40,
                hozAlign: 'center',
                formatter: 'rownum',
                editor: false,
            },

            //setup cells to work as a spreadsheet
            columnDefaults: {
                headerSort: false,
                headerHozAlign: 'center',
                editor: 'input',
                resizable: 'header',
                width: 100,
                cssClass: 'bg-white',
            },
            columnsObj: function () {
                return [
                    {
                        title: '',
                        field: 'delete_row',
                        width: 50,
                        hozAlign: 'left',
                        formatter: (cell) => {
                            const $el = $(`<div>`)
                                .addClass('text-center text-danger')
                                .append('<i class="fa fa-trash" aria-hidden="true"></i>');
                            $el.click(() => {
                                cell.getRow().delete();
                            });
                            return $el[0];
                        },
                        editable: false,
                    },
                    { title: 'Website', field: 'website', width: 200, editable: true },
                    { title: 'Company name', field: 'company_name', width: 100, editable: true },
                    { title: 'Location', field: 'location', width: 100, editable: true },
                    { title: 'User ID', field: 'UID', width: 100, visible: false, editable: true },
                    { title: 'Status', field: 'status', width: 250, formatter: (cell) => cell.getValue(), editable: false },
                ];
            },
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
        },
        //#endregion
        // </editor-fold>
    });
    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        showToast('hello');
        $('#flexSwitchCheckDefault', tableContainer).on('change', (e) => {
            CustomTabulator.iTr_column_show_hide({ UID: e.target.checked });
        });
    });

    $('.submit-copy-paste').click(() => {
        processTableData();
    });

    $('.addRow-copy-paste').click(() => {
        CustomTabulator.TabulatorObj.addRow({}).then(function (row) {
            row.getCell('website').edit();
        });
    });
    $('.reset-copy-paste').click(() => {
        CustomTabulator.TabulatorObj.replaceData([{}]);
        $('.submit-copy-paste', tableContainer)
            .removeClass('btn-outline-secondary')
            .addClass('btn-outline-primary')
            .prop('disabled', false);
    });

    window.aaa = CustomTabulator;
};
//#endregion
// </editor-fold>

let clientDetails = () => {
    const tableId = 'client-details-table';
    const tableContainer = '.client-details-table-container';

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,
        header_filter_dropdown: {
            container: 'tbl_rowSel_w',
            field: 'name',
            uniqueArr: [],
        },
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        //        fTbl_format : "TMPL_tbl_toolbars_f01",
        //        fTbl_controlers : {
        //            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tbl_multy_purps':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblColVisibility':{"c": "me-2"}},{'tblExport':{"c": "me-2"}},{'tblSettings':{"c": ""}}]
        //        },
        tbl_toolbar: {
            tmpl_name: 'readEdit_sColVExp',
            axns: {
                // edit_remove: [".duplicate-row-btn", ],
                el_w: '#TMPLs_iTr_table_devices',
                single_select: { els: ['.devices_singleAndMulti_select'], cc: ['ms-4'] },
                multi_select: { els: ['.devices_singleAndMulti_select'] },
                multi_purps: { els: ['.offDocs_multiP'] },
            },
        },
        TabulatorInitOptions: {
            iTr_multi_row_select_disable: false,
            data: nestedData,
            // ajaxURL: 'https://dev1a.ai-rgus.com/php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php',
            rowHeight: 40,

            sortMode: 'local',
            filterMode: 'local',
            printRowRange: 'all',

            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            rowClickPopup: function (e, row, onRendered) {
                var data = row.getData(),
                    container = document.createElement('div'),
                    contents =
                        "<strong style='font-size:1.2em;'>Row Details</strong><br/><ul style='padding:0;  margin-top:10px; margin-bottom:0;'>";
                contents += '<li><strong>Name:</strong> ' + data.name + '</li>';
                contents += '<li><strong>Gender:</strong> ' + data.gender + '</li>';
                contents += '<li><strong>Favourite Colour:</strong> ' + data.col + '</li>';
                contents += '</ul>';

                container.innerHTML = contents;

                return container;
            },
            pagination: false,
            height: `${$('.table_w').height() - 250}px`, // we do not yet have the real table position or the table header element

            //  We do not use this option as it create other issue. We manage these thing ourself by creating custom checkbox and it's state
            //            selectableRows:true,
            //                rowHeader: {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
            //                    rowRange:"active" //only toggle the values of the active filtered rows
            //                }, hozAlign:"center", headerSort:false},

            iTr_ajaxResponse: function (url, params, response) {
                // this.AdditionalTabulatorInitOptions.preProcessData(this, response);
                //                iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
                return response['dbRows'].map((row, idx) => {
                    if (idx % 2 == 0) {
                        row['is_disabled'] = true;
                    }
                    return row;
                });
            },
            iTr_add_new_row_before: function (fieldData) {
                // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
                fieldData.chbox = 1;
                fieldData.chbox2 = 0;
                fieldData.name = 'New Data';
                return true;
            },
            iTr_row_save_after: function (newData) {
                // $.ajax({
                //     method: 'POST',
                //     url: 'php/update-user.php',
                //     dataType: 'json',
                //     headers: {
                //         csrftoken: _userStr,
                //     },
                //     contentType: 'application/json; charset=utf-8',
                //     data: JSON.stringify(newData),
                // }).done((res) => {
                //     if (res.success == 1) {
                //         CustomTabulator.updateRowStatus();
                //     } else {
                //         alert(res.data?.error || 'Something went wrong');
                //     }
                // });
                CustomTabulator.updateRowStatus();
            },

            printHeader: function () {
                return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
            },
            printFooter: function () {
                const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');

                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                <div class="d-flex gap-2">
                    <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                    <span class='fs-6'>${timeStamp}</span>
                </div>
            </div>`;
            },
            printFormatter: (tableHolder, table) => {
                $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                $(table).find('thead th').css({ 'font-size': '11px' });
                $(table).find('tbody td').css({ 'font-size': '12px' });
            },

            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region columnsObj
            columnsObj: function () {
                return [
                    {
                        field: 'rowSelection',
                        hozAlign: 'left',
                    },
                    {
                        field: 'id',
                        headerFilter: 'input',
                        headerFilterEmptyCheck: function (value) {
                            let filter = CustomTabulator.TabulatorObj.getFilters();
                            if (!value) {
                                filter = filter.filter((field) => field.type != 'like' && field === 'id');
                                CustomTabulator.TabulatorObj.setFilter(filter);
                            }
                            return !value; //only filter when the value is true
                        },
                    },
                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 250,
                        minWidth: 250,
                        editor: 'input',
                        iTr_headerFilter_by_ddFilter: {
                            type: 'multi-checkbox',
                            iTr_dropdown_ops: {
                                // +i+ dd with cell value manipulated
                                setText_byValue: (cell) => {
                                    let cell_value = cell.getValue();
                                    return cell_value.replaceAll(`"`, ``);
                                },
                                fn_onDropdownClick: function (row, selectedRows, table, dropdown) {
                                    function myCustomFilter(selectedValues, data) {
                                        let cellValue = String(data.name).toLowerCase(); // Convert current row's value to lowercase
                                        return selectedValues.some((value) => cellValue.includes(value)); // Check if it includes any selected value
                                    }

                                    const filterBtnText = $('.dropdownMenuButton', dropdown);
                                    filterBtnText.text('Applied filter').addClass('fw-bold');
                                    const resetButton = $(dropdown).next();
                                    resetButton.prop('disabled', false);
                                    if (selectedRows.length) {
                                        //        let selectedValues = selectedRows.map(row => String(row.getData()["field"].replaceAll('\"', '')).toLowerCase());
                                        let selectedValues = selectedRows.map((row) => String(row.getData()['field']).toLowerCase());
                                        // {"iTr_custumize_filter": 1, field: "dytyName"} this part is neccessary to be able to remove (reset) the filters
                                        CustomTabulator.TabulatorObj.setFilter((data) => myCustomFilter(selectedValues, data), {
                                            iTr_custumize_filter: 1,
                                            field: 'name',
                                        });
                                    } else {
                                        let filters = CustomTabulator.TabulatorObj.getFilters();
                                        filters = filters.filter(
                                            (f) => typeof f.type === 'object' && f.type.iTr_custumize_filter && f.type.field !== 'name'
                                        );
                                        CustomTabulator.TabulatorObj.setFilter(filters);
                                    }
                                },
                            },
                        },
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        iTr_addFilter: true,
                        headerWordWrap: true,
                        headerFilterEmptyCheck: function (value) {
                            let filter = CustomTabulator.TabulatorObj.getFilters();
                            if (!value) {
                                filter = filter.filter((field) => field.type != 'like' && field === 'cdsy_names');
                                CustomTabulator.TabulatorObj.setFilter(filter);
                            }
                            return !value; //only filter when the value is true
                        },
                    },

                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        width: 250,
                        minWidth: 250,
                        formatter: this.iTr_cell_editor_formatterEl,
                        // iTr_headerFilter_by_ddFilter: {
                        //     type: 'multi-checkbox',
                        // },
                        editable: this.isFieldEditable,
                        iTr_addFilter: true,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Phone',
                        field: 'phone',
                        visible: isColumnVisible.call(this, 'phone'),
                        width: 150,
                        editor: 'input',
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        iTr_addFilter: true,
                        headerWordWrap: true,
                        headerFilterEmptyCheck: function (value) {
                            let filter = CustomTabulator.TabulatorObj.getFilters();
                            if (!value) {
                                filter = filter.filter((field) => field.type != 'like' && field === 'rec_info');
                                CustomTabulator.TabulatorObj.setFilter(filter);
                            }
                            return !value; //only filter when the value is true
                        },
                    },
                    {
                        title: 'Address info',
                        field: 'address',
                        visible: isColumnVisible.call(this, 'address'),
                        width: 150,
                        formatter: (cell) => {
                            console.log('cell.getValue()', cell.getValue());
                            return cell.getValue().city;
                        },
                        iTr_addFilter: true,
                        formatter: (cell, formatterParams, onRendered) => {
                            if (cell.getValue() === null) {
                                cell.getData()[cell.getField()] = '***';
                            }
                            return this.iTr_cell_editor_formatterEl(cell, formatterParams, onRendered);
                        },
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                        iTr_exp_attr: {
                            iTr_exp_col_handler: (colDef, rowData, idx, headers, row_data, colStyles, type) => {
                                let cellVal = rowData.address;

                                if (cellVal !== '-') {
                                    let map = { from: ['street', 'city', 'state', 'zipCode'], to: ['[ABC]', '[abc]', '[123]', '[@#$]'] };

                                    const pwdStrength = rowData.address;
                                    for (const key in pwdStrength) {
                                        if (pwdStrength.hasOwnProperty(key)) {
                                            // console.log(`${key}: ${pwdStrength[key]}`);

                                            if (cellVal[key] == 1) {
                                                if (type === 'EXCEL') {
                                                    row_data[key] = key.iString_replace_by_array(map.from, map.to);
                                                } else {
                                                    row_data.push(key.iString_replace_by_array(map.from, map.to));
                                                }
                                            } else {
                                                if (type === 'EXCEL') {
                                                    row_data[key] = '';
                                                } else {
                                                    row_data.push('');
                                                }
                                            }

                                            if (idx === 0) {
                                                headers.push({
                                                    title: key.iString_replace_by_array(map.from, map.to),
                                                    field: colDef.field,
                                                });
                                                if (colDef?.iTr_exp_attr?.PDF?.style) {
                                                    colStyles[headers.length - 1] = colDef.iTr_exp_attr.PDF.style;
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            PDF: {
                                style: { cellWidth: 50, fillColor: 'red', textColor: 255 },
                            },
                            EXCEL: {
                                style: { ws_cells: { horizontal: 'right' } },
                            },
                        },
                    },
                    {
                        title: 'Company',
                        field: 'company',
                        visible: isColumnVisible.call(this, 'company'),
                        width: 150,
                        editor: 'input',
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        headerFilterEmptyCheck: function (value) {
                            let filter = CustomTabulator.TabulatorObj.getFilters();
                            if (!value) {
                                filter = filter.filter((field) => field.type != 'like' && field === 'mute_what');
                                CustomTabulator.TabulatorObj.setFilter(filter);
                            }
                            return !value; //only filter when the value is true
                        },
                    },
                    {
                        title: 'Website',
                        field: 'website',
                        visible: isColumnVisible.call(this, 'website'),
                        width: 150,
                        editor: 'input',
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        headerFilterEmptyCheck: function (value) {
                            let filter = CustomTabulator.TabulatorObj.getFilters();
                            if (!value) {
                                filter = filter.filter((field) => field.type != 'like' && field === 'mute_what');
                                CustomTabulator.TabulatorObj.setFilter(filter);
                            }
                            return !value; //only filter when the value is true
                        },
                    },
                    {
                        title: 'Bio',
                        field: 'bio',
                        visible: isColumnVisible.call(this, 'bio'),
                        width: 150,
                        editor: 'input',
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        headerFilterEmptyCheck: function (value) {
                            let filter = CustomTabulator.TabulatorObj.getFilters();
                            if (!value) {
                                filter = filter.filter((field) => field.type != 'like' && field === 'mute_what');
                                CustomTabulator.TabulatorObj.setFilter(filter);
                            }
                            return !value; //only filter when the value is true
                        },
                    },
                    {
                        title: 'Animal',
                        field: 'pet',
                        visible: isColumnVisible.call(this, 'pet'),
                        width: 150,
                        editor: 'input',
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        headerFilterEmptyCheck: function (value) {
                            let filter = CustomTabulator.TabulatorObj.getFilters();
                            if (!value) {
                                filter = filter.filter((field) => field.type != 'like' && field === 'mute_what');
                                CustomTabulator.TabulatorObj.setFilter(filter);
                            }
                            return !value; //only filter when the value is true
                        },
                    },
                    {
                        title: 'Timezone',
                        field: 'timezone',
                        visible: isColumnVisible.call(this, 'timezone'),
                        width: 150,
                        editor: 'input',
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        headerFilterEmptyCheck: function (value) {
                            let filter = CustomTabulator.TabulatorObj.getFilters();
                            if (!value) {
                                filter = filter.filter((field) => field.type != 'like' && field === 'mute_what');
                                CustomTabulator.TabulatorObj.setFilter(filter);
                            }
                            return !value; //only filter when the value is true
                        },
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 350,
                        print: false,
                        download: false,
                        headerSort: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                ];
            },
            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -iTr_rowFormatter_ before|after
            iTr_row_formatter_before: function (row) {
                //                iConsole("------------ Table obj's rowFormatter Before ------------  ");

                var data = row.getData();
                //                if(data.isCurrentRow?.edit_mode || data.isCurrentRow?.edit_mode)
                $(row.getElement()).attr('data-location', data.location);

                if (data.location == 'India') {
                    row.getCell('location').getElement().style.color = 'blue';
                }
                if (data.location == 'China') {
                    $(row.getElement()).addClass('china');

                    // add custom html to the cell
                    row.getCell('location').getElement().innerHTML = `<a href='google.com'>${data.location}</a>`;
                }

                if (row.getData().isCurrentRow?.edit_mode) {
                    $(row.getElement()).removeClass('china');
                }

                return true;
            },
            iTr_row_formatter_after: function (row) {
                if (row.getData().is_disabled) {
                    $(row.getElement()).addClass('disable-row');
                }
                return true;
                //                iConsole("------------ Table obj's rowFormatter After ------------  ");
            },

            //#endregion
            // </editor-fold>
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
        },
        exp_obj: {
            rec_name: { txt: '' },
        },
        //#endregion
        // </editor-fold>
    });

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        let values = [];
        const headerTreeSearchFilter = (data, filterParams) => {
            // If search is empty, show all rows
            if (!values.length) return true;

            // Check if any selected column contains the search text
            const matchesSearch = values.some((val) => {
                const cellValue = data[filterParams.field];
                if (!cellValue) return false;
                return String(cellValue).toLowerCase().includes(val.toLowerCase());
            });

            // If this row matches, or has children that match, show it
            if (matchesSearch) return true;

            // If this row has children, check them recursively
            let children = data._children ? (Array.isArray(data._children) ? data._children : [data._children]) : [];

            return children.some((child) => headerTreeSearchFilter(child, filterParams));
        };

        function getTopParent(row) {
            let parent = row.getTreeParent();
            while (parent) {
                row = parent;
                parent = row.getTreeParent();
            }
            return row;
        }

        const headerDropdown = createDropdownForTable(
            {
                dd_el_w: { class: 'w-100' },
                dd_calling_btn: {
                    text: 'Filter by',
                    title: 'Filter by',
                    width: 200,
                    class: 'dd_arrow_end text-start w-100',
                    style: 'background-color:#fff; color:#212529; border:1px solid #ced4da;',
                    reseizable: true,
                }, // the element opened once we
                dd_select_list: { id: `header_dropdown_name_${performance.now().toString().replace('.', '_')}`, deselectAll: true },
                iTr_table_index: 'name',
                iTr_field_name: 'name',
                iTr_ddList: { type: 'button' },
                fn_onDropdownClick: (row, selectedRows, table, dropdown) => {
                    console.log('first', JSON.parse(JSON.stringify(table.getSelectedData())));
                    const filterBtnText = $('.dropdownMenuButton', dropdown);
                    filterBtnText.text('Apply Filter').addClass('fw-bold');
                    values = selectedRows.map((row) => row.getData()['name']);
                    resetButton.prop('disabled', false);
                },
                dd_moveToBody: true,
            },
            nestedData
        );

        const resetButton = $('<button>', {
            class: 'iDDselnWfilter_btn form-control form-control-sm border py-1 reset_button text-secondary ms-1',
            //                            html: '<i class="fa fa-redo"></i><i class="fa fa-rotate-right" data-test-el="1"></i>',
            html: '<i class="fa fa-redo"></i>',
            click: () => {
                const filterBtnText = $('.dropdownMenuButton', headerDropdown.dropdown);
                let filters = CustomTabulator.TabulatorObj.getFilters();
                filters = filters.filter((f) => typeof f.type === 'object' && !f.type.uniqueFilter);
                CustomTabulator.TabulatorObj.setFilter(filters);
                filterBtnText.text('Filter by').removeClass('fw-bold');
                resetButton.prop('disabled', true);
                const table = headerDropdown.getTableInstance();
                if (table) {
                    table.deselectRow();
                    table.redraw(true);
                }
                const dropdownToggle = $('.dropdownMenuButton', headerDropdown.dropdown);
                bootstrap.Dropdown.getInstance(dropdownToggle)?.hide();
            },
        });
        headerDropdown.dropdown.click(() => {
            const filterBtnText = $('.dropdownMenuButton', headerDropdown.dropdown);
            if (filterBtnText.text() === 'Apply Filter') {
                const filters = CustomTabulator.TabulatorObj.getFilters().filter((item) => {
                    if (typeof item.type === 'object' && item.type.uniqueFilter) {
                        return false;
                    }
                    return true;
                });
                CustomTabulator.TabulatorObj.setFilter(filters);
                CustomTabulator.TabulatorObj.addFilter(headerTreeSearchFilter, { field: 'name', uniqueFilter: true });
                filterBtnText.text('Applied filter').addClass('fw-bold');
            }
        });
        $(`#client-details-table-header-dropdown`).prepend(headerDropdown.dropdown).append(resetButton).css({
            width: '250px',
        });
    });

    CustomTabulator.tableContainer = tableContainer;
    window.tempTable = CustomTabulator; // +info+ adding to global object to access it from developer tools and anywhere else in the code for debugging

    $('[data-bs-toggle="tooltip"]').tooltip();
    CustomTabulator.TabulatorObj.on('scrollVertical', () => {
        $.each($('.popover .close_on_scroll'), function (inx, el) {
            $(el).closest('.popover').remove();
        });
    });
};

let json_object_sort = () => {
    const tableId = 'json_object_sort';
    const tableContainer = '.json_object_sort-container';
    const colwrapper = (subField, proto, add) => {
        return {
            sorter: function (a, b, aRow, bRow, column) {
                return a[subField].localeCompare(b[subField]);
            },
            formatter: (cell) => cell.getValue()[subField],
            headerFilterFunc: (headerValue, rowValue = '', rowData, filterParams) => {
                const cell_data = rowValue.replaceAll('/', ' / ');

                const r_value = (cell_data || ' - ').toString().toLowerCase();
                const s_value = headerValue.toLowerCase();
                return r_value.includes(s_value);
            },
            // headerFilterFunc: (headerValue, rowValue, rowData, filterParams)=>{
            //     let r_value = '';
            //     if(rowValue.mute){
            //         r_value = 'Mute until '+ rowValue.mute.d;
            //     } else if(rowValue.latency){
            //         r_value = 'Latency '+ rowValue.latency;
            //     } else {
            //         $.each(rowValue, (idx, val)=>{
            //             r_value = r_value + `${idx} = ${val} `
            //         })
            //     }
            //     r_value = r_value.toLowerCase();
            //     const s_value = headerValue.toLowerCase();
            //     return r_value.includes(s_value);
            // }
            // headerFilterFunc: (headerValue, rowValue, rowData, filterParams)=>{
            //     const r_value = (rowValue?.[proto]||'') + (rowValue?.[add]||'');
            //     const s_value = headerValue;
            //     return r_value.includes(s_value);
            // }
        };
    };
    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,
        header_filter_dropdown: {
            container: 'tbl_rowSel_w',
            field: 'name',
            uniqueArr: [],
        },
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        //        fTbl_format : "TMPL_tbl_toolbars_f01",
        //        fTbl_controlers : {
        //            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tbl_multy_purps':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblColVisibility':{"c": "me-2"}},{'tblExport':{"c": "me-2"}},{'tblSettings':{"c": ""}}]
        //        },
        tbl_toolbar: {
            tmpl_name: 'dataTree_sColVExp',
            axns: {
                dataTree: {
                    c: `fas fa-2x fa-${localStorage.getItem('loginAs_globalExpColl') === 'true' ? 'minus' : 'plus'}-square`,
                    click: () => {
                        CustomTabulator.toggleAllTreeRows($('#expCol_master').hasClass('fa-plus-square'));
                    },
                },
            },
        },
        TabulatorInitOptions: {
            iTr_expand_multi_rows: true,
            iTr_showSortingBadgeNumber: true,
            iTr_multi_row_select_disable: false,
            iTr_export_only_filtered_data: true,
            dataTreeCollapseElement: "<i class='fas fa-minus-square'></i>", //fontawesome toggle icon
            dataTreeExpandElement: "<i class='fas fa-plus-square'></i>", //fontawesome toggle icon
            dataTreeElementColumn: 'name',
            data: latest,
            // ajaxURL: 'https://dev1a.ai-rgus.com/php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php',
            rowHeight: 40,

            sortMode: 'local',
            filterMode: 'local',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            pagination: false,
            height: `${$('.table_w').height() - 250}px`, // we do not yet have the real table position or the table header element

            //  We do not use this option as it create other issue. We manage these thing ourself by creating custom checkbox and it's state
            //            selectableRows:true,
            //                rowHeader: {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
            //                    rowRange:"active" //only toggle the values of the active filtered rows
            //                }, hozAlign:"center", headerSort:false},

            iTr_ajaxResponse: function (url, params, response) {
                // this.AdditionalTabulatorInitOptions.preProcessData(this, response);
                //                iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
                return response['dbRows'].map((row, idx) => {
                    if (idx % 2 == 0) {
                        row['is_disabled'] = true;
                    }
                    return row;
                });
            },
            iTr_add_new_row_before: function (fieldData) {
                // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
                fieldData.chbox = 1;
                fieldData.chbox2 = 0;
                fieldData.name = 'New Data';
                return true;
            },
            iTr_row_save_after: function (newData) {
                // $.ajax({
                //     method: 'POST',
                //     url: 'php/update-user.php',
                //     dataType: 'json',
                //     headers: {
                //         csrftoken: _userStr,
                //     },
                //     contentType: 'application/json; charset=utf-8',
                //     data: JSON.stringify(newData),
                // }).done((res) => {
                //     if (res.success == 1) {
                //         CustomTabulator.updateRowStatus();
                //     } else {
                //         alert(res.data?.error || 'Something went wrong');
                //     }
                // });
                CustomTabulator.updateRowStatus();
            },

            printHeader: function () {
                return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
            },
            printFooter: function () {
                const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');

                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                <div class="d-flex gap-2">
                    <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                    <span class='fs-6'>${timeStamp}</span>
                </div>
            </div>`;
            },
            printFormatter: (tableHolder, table) => {
                $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                $(table).find('thead th').css({ 'font-size': '11px' });
                $(table).find('tbody td').css({ 'font-size': '12px' });
            },
            printRowRange: 'all',

            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region columnsObj
            columnsObj: function () {
                return [
                    {
                        field: 'id',
                    },
                    {
                        title: 'Hard disk status',
                        field: 'hdStatus',
                        visible: isColumnVisible.call(this, 'hdStatus'),
                        width: 250,
                        minWidth: 250,
                        iExcludeFromList: { cv: 1 },
                        ...colwrapper('t'),
                    },
                    {
                        title: '',
                        field: 'dummy01',
                        visible: isColumnVisible.call(this, 'dummy01'),
                        width: 200,
                        headerSort: false,
                        iExcludeFromList: { src: 0, cv: 1 },
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            const $el_w = $('<div></div>');
                            let $dd_el_w = $('<div class="dropdown" role="group">');
                            let $dd_calling_btn = $(
                                `<button class="clGearMenu dropdown-toggle h7 btn btn-sm btn-info fw-bold float-start _ms-1 px-1" data-bs-toggle="dropdown" type="button" > <i class="fas fa-cog"></i></button>`
                            ).click(function () {
                                console.log('1111', 1111);
                            });
                            const $btn_invoice = $(`<button class="btn btn-outline-primary h7" type="button">
                                    <i class="fad fa-file-invoice-dollar fa-lg pe-2"></i>Create an invoice</button>`).click(function (e) {
                                // <editor-fold defaultstate="collapsed" desc=" on: click ">
                                // </editor-fold>
                            });
                            const $dd_select_list = $(
                                `<ul class="dropdown-menu h6 shadow-lg border border-dark border-w1" style="background-color: #4ac8e1; z-index: 1010;">`
                            );

                            $dd_el_w.append($dd_calling_btn, $dd_select_list);
                            $dd_el_w.on('show.bs.dropdown', function () {
                                console.log('2222', 2222);
                                if ($dd_calling_btn.attr('data-created')) {
                                    // there is info and the button is set already as dropdown - all good.
                                    return;
                                }

                                $dd_calling_btn.attr('data-created', 'dropdown');
                                $(
                                    'ul.dropdown-menu',
                                    $(this)
                                ).append(`<li><a class="cl_information dropdown-item border" href="#"><i class="fad fa-book-open pe-2"></i>Information</a></li>
                                <li><a class="cl_db_info dropdown-item border text-danger" href="#"><i class="fad fa-database pe-2"></i>D.B. Information</a></li>`);
                                $('ul.dropdown-menu', $(this)).addClass('moved_ddown_to_body').appendTo('body');
                            });

                            $el_w.append($dd_el_w, $btn_invoice);
                            return $el_w[0];
                        },
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 350,
                        print: false,
                        download: false,
                        headerSort: false,
                        iExcludeFromList: { src: 1, cv: 1 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                ];
            },
            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -iTr_rowFormatter_ before|after
            iTr_row_formatter_before: function (row) {
                //                iConsole("------------ Table obj's rowFormatter Before ------------  ");

                var data = row.getData();
                //                if(data.isCurrentRow?.edit_mode || data.isCurrentRow?.edit_mode)
                $(row.getElement()).attr('data-location', data.location);

                if (data.location == 'India') {
                    row.getCell('location').getElement().style.color = 'blue';
                }
                if (data.location == 'China') {
                    $(row.getElement()).addClass('china');

                    // add custom html to the cell
                    row.getCell('location').getElement().innerHTML = `<a href='google.com'>${data.location}</a>`;
                }

                if (row.getData().isCurrentRow?.edit_mode) {
                    $(row.getElement()).removeClass('china');
                }

                return true;
            },
            iTr_row_formatter_after: function (row) {
                if (row.getData().is_disabled) {
                    $(row.getElement()).addClass('disable-row');
                }
                return true;
                //                iConsole("------------ Table obj's rowFormatter After ------------  ");
            },

            //#endregion
            // </editor-fold>
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
        },
        exp_obj: {
            rec_name: { txt: '' },
        },
        //#endregion
        // </editor-fold>
    });

    CustomTabulator.tableContainer = tableContainer;
    window.tempTable = CustomTabulator; // +info+ adding to global object to access it from developer tools and anywhere else in the code for debugging
};

let exampleDropdown = () => {
    const container = 'dd_container';
    const title = 'ajax dropdown';
    const { dropdown, getTableInstance } = createDropdownForTable(
        {
            dd_el_w: { class: 'w-100' },
            dd_calling_btn: {
                text: title,
                title,
                width: 200,
                class: 'dd_arrow_end text-start w-100',
                style: 'background-color:#fff; color:#212529; border:1px solid #ced4da;',
                reseizable: true,
            }, // the element opened once we
            dd_select_list: { id: 'ajax-dd', deselectAll: true },
            iTr_table_index: 'd_id',
            iTr_field_name: 'value',
            fn_onDropdownClick: (row, selectedRows, table, dropdown) => {
                handleCheckboxChange(row, selectedRows, table, dropdown, filterIndex, dropdownId, type);
            },
            dd_moveToBody: true,
            iTr_add_tableOptions: {
                // ajaxURL: 'php/iDBcode.php',
                // ajaxConfig: {
                //     method: 'POST',
                //     headers: {
                //         csrftoken: _userStr, // Add the CSRFToken to the headers
                //     },
                // },
                // ajaxResponse: function (url, params, response) {
                //     console.log('response', response);
                //     //url - the URL of the request
                //     //params - the parameters passed with the request
                //     //response - the JSON object returned in the body of the response.

                //     return response.dbRows; //return the response data to tabulator
                // },
                groupBy: 'accTypeGr',
                groupHeader: function (value, count, data, group) {
                    return data[0].groupName + "<span style='color:#d00; margin-left:10px;'>(" + count + ' item)</span>';
                },
            },
        },
        [
            {
                0: true,
                groupName: 'Cameras',
                accTypeGr: '0',
                runMode: 'a',
                d_id: '93fe814a8',
                linktype: 'rtsp',
                prot: 'RTSP',
                port: '554',
                ip: null,
                sets: null,
                value: 'Avigilon 4-lens Camera - RTSP',
            },
            {
                0: true,
                groupName: 'Cameras',
                accTypeGr: '0',
                runMode: 'a',
                d_id: '046bcd0c3',
                linktype: '0',
                prot: 'HTTP',
                port: '80',
                ip: null,
                sets: null,
                value: 'Avigilon Rialto 1-lens',
            },
            {
                0: true,
                groupName: 'Cameras',
                accTypeGr: '0',
                runMode: 'a',
                d_id: '19bbac660',
                linktype: '0',
                prot: 'HTTP',
                port: '80',
                ip: null,
                sets: null,
                value: 'Avigilon Rialto 4-lens',
            },
            {
                0: true,
                groupName: 'Cameras',
                accTypeGr: '0',
                runMode: 'a',
                d_id: '93fe814a8',
                linktype: 'rtsp',
                prot: 'RTSP',
                port: '554',
                ip: null,
                sets: null,
                value: 'Avigilon 4-lens Camera - RTSP',
            },
            {
                0: true,
                groupName: 'Cameras',
                accTypeGr: '0',
                runMode: 'a',
                d_id: '046bcd0c3',
                linktype: '0',
                prot: 'HTTP',
                port: '80',
                ip: null,
                sets: null,
                value: 'Avigilon Rialto 1-lens',
            },
            {
                0: true,
                groupName: 'Cameras',
                accTypeGr: '0',
                runMode: 'a',
                d_id: '19bbac660',
                linktype: '0',
                prot: 'HTTP',
                port: '80',
                ip: null,
                sets: null,
                value: 'Avigilon Rialto 4-lens',
            },

            {
                0: true,
                groupName: 'Cameras1',
                accTypeGr: '1',
                runMode: 'a',
                d_id: '93fe814a8',
                linktype: 'rtsp',
                prot: 'RTSP',
                port: '554',
                ip: null,
                sets: null,
                value: 'Avigilon 4-lens Camera - RTSP',
            },
            {
                0: true,
                groupName: 'Cameras1',
                accTypeGr: '1',
                runMode: 'a',
                d_id: '046bcd0c3',
                linktype: '0',
                prot: 'HTTP',
                port: '80',
                ip: null,
                sets: null,
                value: 'Avigilon Rialto 1-lens',
            },
            {
                0: true,
                groupName: 'Cameras1',
                accTypeGr: '1',
                runMode: 'a',
                d_id: '19bbac660',
                linktype: '0',
                prot: 'HTTP',
                port: '80',
                ip: null,
                sets: null,
                value: 'Avigilon Rialto 4-lens',
            },
            {
                0: true,
                groupName: 'Cameras1',
                accTypeGr: '1',
                runMode: 'a',
                d_id: '93fe814a8',
                linktype: 'rtsp',
                prot: 'RTSP',
                port: '554',
                ip: null,
                sets: null,
                value: 'Avigilon 4-lens Camera - RTSP',
            },
            {
                0: true,
                groupName: 'Cameras1',
                accTypeGr: '1',
                runMode: 'a',
                d_id: '046bcd0c3',
                linktype: '0',
                prot: 'HTTP',
                port: '80',
                ip: null,
                sets: null,
                value: 'Avigilon Rialto 1-lens',
            },
            {
                0: true,
                groupName: 'Cameras1',
                accTypeGr: '1',
                runMode: 'a',
                d_id: '19bbac660',
                linktype: '0',
                prot: 'HTTP',
                port: '80',
                ip: null,
                sets: null,
                value: 'Avigilon Rialto 4-lens',
            },
        ]
    );
    // $(`#${container}`).append(dropdown).css({
    //     width: '218px',
    //     'font-size': '18px',
    // });

    $.fn.addD_tooltip = function (opIn) {
        var opDef = {
            t: 'Problem while saving data.<br>Try again.',
            cusClass: 'tooltip-danger tt_width-400',
            tOut: 4000, // -1 will skip this option
            html: true,
            plcmnt: 'auto',
            tmpl: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><span class="dTooltipClose btn btn-close bg-white float-end h7 mt-1 me-1 p-1" aria-label="Close"></span><div class="tooltip-inner"></div></div>',
            tt_width: '', // 400px, MUST have tt_inner-width in "cusClass". This will work via CSS
            fn_disposed: function () {},
            do_setTimeout: 1, // to control the timeout to close the tooltip
        };

        let op = $.extend(opDef, opIn || {});
        let _this = this;

        $('body').css({ '--tt_width': op['tt_width'] });
        $(_this)
            .tooltip({
                title: op['t'],
                html: op['html'],
                customClass: op['cusClass'],
                template: op['tmpl'],
                placement: op['plcmnt'],
            })
            .tooltip('show');

        if (op['tOut'] > -1) {
            setTimeout(function () {
                if (op['do_setTimeout']) {
                    do_close_dTooltip();
                }
                op['do_setTimeout'] = 1;
            }, op['tOut']);
        }

        // Click event for the close button inside the tooltip
        $('body').on('click', '.dTooltipClose', function (e) {
            do_close_dTooltip();
            op['do_setTimeout'] = 0;
            e.stopImmediatePropagation();
        });

        function do_close_dTooltip() {
            $(_this).tooltip('dispose');
            op['fn_disposed']();
            $('body').attr('style', function (i, style) {
                return style && style.replace(/--tt_width *:[^;]+;?/g, '');
            });
        }
    };

    var $button = $('<button></button>')
        .attr('type', 'button')
        .addClass('btn btn-primary')
        .attr('data-toggle', 'tooltip')
        .attr('data-placement', 'top')
        .attr('title', 'This is a tooltip')
        .text('Hover me to see the tooltip');

    // Append the button to the body
    $(`#${container}`).append($button);

    // Apply the dynamic tooltip using the custom method
    $button.addD_tooltip({
        t: 'Custom message goes here.',
        cusClass: 'tooltip-info',
        tOut: -1, // Close after 5 seconds
        fn_disposed: function () {
            console.log('Tooltip closed.');
        },
    });
};

let autoTable = () => {
    let tableId = 'autopay-table';
    const tableContainer = '.autoPay-table-container';
    const pageId = 'autopay';

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,
        iTr_masterFilterClear_ops: {
            exceptions: [],
        },
        pageId,
        DefaultHiddenColumns: [], // To activate this option
        tbl_toolbar: {
            tmpl_name: 'edit_sColVExp',
            axns: {
                edit_remove: [
                    '.enable-row-edit-btn',
                    '.update-edited-row-btn',
                    '.discard-edited-row-btn',
                    '.duplicate-row-btn',
                    '.delete-row-btn',
                ],
                el_w: '#TMPLs_iTr_probs_btns_multy_sel',
                single_select: { els: ['.autopay-set_multi_select'] },
                multi_select: { els: ['.autopay-set_multi_select'] },
            },
        },
        TabulatorInitOptions: {
            renderVerticalBuffer: 10000,
            iTr_expand_multi_rows: true,
            iTr_showSortingBadgeNumber: true,
            iTr_multi_row_select_disable: false,
            iTr_run_before_creatingTr: () => {
                console.log('working');
            },
            data: autoPaydata,
            rowHeight: 40,
            sortMode: 'local',
            filterMode: 'local',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            pagination: false,
            height: `${$('.table_w').height() - 189}px`, // we do not yet have the real table position or the table header element

            printRowRange: 'all',

            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region columnsObj
            columnsObj: function () {
                return [
                    {
                        field: 'rowSelection',
                    },
                    {
                        field: 'id',
                    },
                    {
                        title: 'Client Name',
                        field: 'display_name',
                        visible: isColumnVisible.call(this, 'display_name'),
                        minWidth: 200,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: '',
                        field: 'is_disabled',
                        visible: false,
                        mutator: function (value, data, type, params, component) {
                            const amountDeb = data.amount_adj ?? data.amount;
                            return data.max < amountDeb;
                        },
                        minWidth: 200,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Inv Date',
                        field: 'inv_date',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'inv_date'),
                        headerFilter: true,
                        mutator: function (value, data, type, params, component) {
                            return new Date(data.bd_date).toLocaleDateString('en-US');
                        },
                        formatter: this.iTr_cell_editor_formatterEl,
                        minWidth: 200,
                    },
                    {
                        title: 'Max',
                        field: 'max',
                        hozAlign: 'right',
                        formatter: (cell) => {
                            let $el = $(
                                `<span>${cell
                                    .getValue()
                                    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`
                            );
                            if (cell.getValue() < cell.getData()?.amountDebit) {
                                $(cell.getElement()).addClass('bg-danger text-white');
                            }
                            return $el[0];
                        },
                        visible: isColumnVisible.call(this, 'max'),
                        minWidth: 150,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Amount to Debit',
                        field: 'amountDebit',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'amountDebit'),
                        mutator: function (value, data, type, params, component) {
                            return data.amount_adj ?? data.amount;
                        },
                        formatter: (cell) => {
                            let $el = $(
                                `<span>${cell
                                    .getValue()
                                    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`
                            );
                            if (cell.getData()?.amount_adj) {
                                $(cell.getElement()).addClass('bg-primary text-white');
                            }
                            return $el[0];
                        },
                        minWidth: 150,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Amount',
                        field: 'amount',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'amount'),
                        formatter: (cell) => {
                            return cell.getValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        },
                        minWidth: 150,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Terms',
                        field: 'term',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'term'),
                        minWidth: 150,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Debit Date',
                        field: 'debitDate',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'debitDate'),
                        minWidth: 200,
                        headerFilter: true,
                        mutator: function (value, data, type, params, component) {
                            const date = new Date(data.bd_date);
                            const daysToAdd = data.term;
                            date.setDate(date.getDate() + daysToAdd);

                            const formattedDate = date.toLocaleDateString('en-US');
                            return formattedDate;
                        },
                    },
                    {
                        title: 'Access',
                        field: 'acc',
                        visible: isColumnVisible.call(this, 'acc'),
                        minWidth: 200,
                        headerFilter: true,
                        formatter: (cell) => {
                            const rowData = cell.getData();
                            const $el = $(`<span>${cell.getValue() === 'args' ? 'Ai-RGUS' : 'Client Only'}</span>`);
                            if (rowData.max < rowData.amountDebit && cell.getValue() != 'args') {
                                $(cell.getElement()).addClass('bg-danger text-white');
                            }
                            return $el[0];
                        },
                        sorter: 'string',
                    },
                    {
                        title: 'Acc end',
                        field: 'aend',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'aend'),
                        minWidth: 200,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Invoice number',
                        field: 'bd_inv_num',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'bd_inv_num'),
                        minWidth: 200,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Client ID',
                        field: 'clientID',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'clientID'),
                        minWidth: 200,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Bill CID',
                        field: 'cID',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'cID'),
                        minWidth: 200,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Bill BID',
                        field: 'bID',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'bID'),
                        minWidth: 200,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 350,
                        print: false,
                        download: false,
                        headerSort: false,
                    },
                ];
            },
            //#endregion
            // </editor-fold>

            iTr_row_formatter_before: function (row) {
                const rowData = row.getData();
                if (rowData.max < rowData.amountDebit) {
                    let $row = row.getElement();
                    $($row).addClass('disabled text-muted');
                    $('*', $($row)).removeClass('text-warning text-success').prop('disabled', 1);
                    $(`[tabulator-field="rowSelection"] input[type="checkbox"]`, $($row)).addClass('d-none');
                }
                return true;
            },
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Print'],
            // do_not_export_fields:["rowExpand", 'name',"__dummy__", "__dummy_front__"],
            isOEM: 10,
            sort: { name: 1, email: -1 },
            pdf: {
                fileName: 'test222',
                // exp_pdf_styles: (data, column, value, doc) => {
                //     if (data.section === 'head') {
                //         data.cell.styles.fillColor = '#0d6efd';
                //     }
                // }
                // #0d6efd
            },
            excel: {
                fileName: 'test',
                whorkSheetName: 'sheet22',
                headerTextAlign: 'right',
                rowTextAlign: 'left',
            },
            print: {},
            handlers: {
                excel: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait',
                    });
                },
                print: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.print(false, true, {});
                },
            },
        },
        //#endregion
        // </editor-fold>
    }); // +info+ adding to global object to access it from developer tools and anywhere else in the code for debugging

    let $table_header_toolbar_w = $('> .table-header-toolbar_w', CustomTabulator.tableContainerElement);
    $('.autopay-run_script', $table_header_toolbar_w)
        .off('click')
        .click(function () {
            const billing_data = CustomTabulator.TabulatorObj.getSelectedData().map((data) => {
                let debitDate = new Date(data.bd_date);

                debitDate.setDate(debitDate.getDate() + data.term);
                debitDate = debitDate.toISOString().split('T')[0];
                const item = {
                    ags_billingClID: data.clientID,
                    amount: data.amountDebit,
                    debData: debitDate,
                    invoiceDate: data.bd_date,
                    invRef: data.bd_inv_num,
                    bill_bID: data.bID,
                    bill_cID: data.cID,
                };
                return item;
            });
        });
};

let dualTable = (isPartial) => {
    let tableId = 'dual-table';
    const tableContainer = '.dual-table-container';
    const pageId = 'dual-page';

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,
        iTr_masterFilterClear_ops: {
            exceptions: [],
        },
        pageId,
        DefaultHiddenColumns: [], // To activate this option
        tbl_toolbar: {
            tmpl_name: 'edit_sColVExp',
            axns: {
                edit_remove: [
                    '.enable-row-edit-btn',
                    '.update-edited-row-btn',
                    '.discard-edited-row-btn',
                    '.duplicate-row-btn',
                    '.delete-row-btn',
                ],
                el_w: '#TMPLs_iTr_probs_btns_multy_sel',
                single_select: { els: ['.autopay-set_multi_select'] },
                multi_select: { els: ['.autopay-set_multi_select'] },
            },
        },
        TabulatorInitOptions: {
            renderVerticalBuffer: 10000,
            iTr_expand_multi_rows: true,
            iTr_showSortingBadgeNumber: true,
            iTr_multi_row_select_disable: false,
            iTr_run_before_creatingTr: () => {
                console.log('working');
            },
            data: autoPaydata,
            rowHeight: 40,
            sortMode: 'local',
            filterMode: 'local',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            pagination: false,
            height: `${$('.table_w').height() - 189}px`, // we do not yet have the real table position or the table header element

            printRowRange: 'all',

            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region columnsObj
            columnsObj: function () {
                return [
                    {
                        field: 'rowSelection',
                    },
                    {
                        field: 'id',
                    },
                    ...(isPartial
                        ? []
                        : [
                              // Conditionally remove the `id` column
                              {
                                  title: 'Client Name',
                                  field: 'display_name',
                                  visible: isColumnVisible.call(this, 'display_name'),
                                  minWidth: 200,
                                  headerFilter: true,
                                  sorter: 'string',
                              },
                          ]),
                    {
                        title: '',
                        field: 'is_disabled',
                        visible: false,
                        mutator: function (value, data, type, params, component) {
                            const amountDeb = data.amount_adj ?? data.amount;
                            return data.max < amountDeb;
                        },
                        minWidth: 200,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Inv Date',
                        field: 'inv_date',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'inv_date'),
                        headerFilter: true,
                        mutator: function (value, data, type, params, component) {
                            return new Date(data.bd_date).toLocaleDateString('en-US');
                        },
                        minWidth: 200,
                    },
                    {
                        title: 'Max',
                        field: 'max',
                        hozAlign: 'right',
                        formatter: (cell) => {
                            let $el = $(
                                `<span>${cell
                                    .getValue()
                                    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`
                            );
                            if (cell.getValue() < cell.getData()?.amountDebit) {
                                $(cell.getElement()).addClass('bg-danger text-white');
                            }
                            return $el[0];
                        },
                        visible: isColumnVisible.call(this, 'max'),
                        minWidth: 150,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Amount to Debit',
                        field: 'amountDebit',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'amountDebit'),
                        mutator: function (value, data, type, params, component) {
                            return data.amount_adj ?? data.amount;
                        },
                        formatter: (cell) => {
                            let $el = $(
                                `<span>${cell
                                    .getValue()
                                    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`
                            );
                            if (cell.getData()?.amount_adj) {
                                $(cell.getElement()).addClass('bg-primary text-white');
                            }
                            return $el[0];
                        },
                        minWidth: 150,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Amount',
                        field: 'amount',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'amount'),
                        formatter: (cell) => {
                            return cell.getValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        },
                        minWidth: 150,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Terms',
                        field: 'term',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'term'),
                        minWidth: 150,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Debit Date',
                        field: 'debitDate',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'debitDate'),
                        minWidth: 200,
                        headerFilter: true,
                        mutator: function (value, data, type, params, component) {
                            const date = new Date(data.bd_date);
                            const daysToAdd = data.term;
                            date.setDate(date.getDate() + daysToAdd);

                            const formattedDate = date.toLocaleDateString('en-US');
                            return formattedDate;
                        },
                    },
                    {
                        title: 'Access',
                        field: 'acc',
                        visible: isColumnVisible.call(this, 'acc'),
                        minWidth: 200,
                        headerFilter: true,
                        formatter: (cell) => {
                            const rowData = cell.getData();
                            const $el = $(`<span>${cell.getValue() === 'args' ? 'Ai-RGUS' : 'Client Only'}</span>`);
                            if (rowData.max < rowData.amountDebit && cell.getValue() != 'args') {
                                $(cell.getElement()).addClass('bg-danger text-white');
                            }
                            return $el[0];
                        },
                        sorter: 'string',
                    },
                    {
                        title: 'Acc end',
                        field: 'aend',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'aend'),
                        minWidth: 200,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Invoice number',
                        field: 'bd_inv_num',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'bd_inv_num'),
                        minWidth: 200,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Client ID',
                        field: 'clientID',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'clientID'),
                        minWidth: 200,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Bill CID',
                        field: 'cID',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'cID'),
                        minWidth: 200,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: 'Bill BID',
                        field: 'bID',
                        hozAlign: 'right',
                        visible: isColumnVisible.call(this, 'bID'),
                        minWidth: 200,
                        headerFilter: true,
                        sorter: 'string',
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 350,
                        print: false,
                        download: false,
                        headerSort: false,
                    },
                ];
            },
            //#endregion
            // </editor-fold>

            iTr_row_formatter_before: function (row) {
                const rowData = row.getData();
                if (rowData.max < rowData.amountDebit) {
                    let $row = row.getElement();
                    $($row).addClass('disabled text-muted');
                    $('*', $($row)).removeClass('text-warning text-success').prop('disabled', 1);
                    $(`[tabulator-field="rowSelection"] input[type="checkbox"]`, $($row)).addClass('d-none');
                }
                return true;
            },
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Print'],
            // do_not_export_fields:["rowExpand", 'name',"__dummy__", "__dummy_front__"],
            isOEM: 10,
            sort: { name: 1, email: -1 },
            pdf: {
                fileName: 'test222',
                // exp_pdf_styles: (data, column, value, doc) => {
                //     if (data.section === 'head') {
                //         data.cell.styles.fillColor = '#0d6efd';
                //     }
                // }
                // #0d6efd
            },
            excel: {
                fileName: 'test',
                whorkSheetName: 'sheet22',
                headerTextAlign: 'right',
                rowTextAlign: 'left',
            },
            print: {},
            handlers: {
                excel: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait',
                    });
                },
                print: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.print(false, true, {});
                },
            },
        },
        //#endregion
        // </editor-fold>
    }); // +info+ adding to global object to access it from developer tools and anywhere else in the code for debugging

    let $table_header_toolbar_w = $('> .table-header-toolbar_w', CustomTabulator.tableContainerElement);
    $('#btnradio1')
        .off('click')
        .click(function () {
            CustomTabulator.TabulatorObj.destroy();
            dualTable();
        });
    $('#btnradio2')
        .off('click')
        .click(function () {
            CustomTabulator.TabulatorObj.destroy();
            dualTable(true);
        });
};

let dataTable = () => {
    const columns = [
        { colName: $("<div class='text-danger'>Name</div>"), field: 'name' },
        {
            colName: 'Age',
            field: 'age',
            formatter: function (value) {
                // Color age: red if under 18, green otherwise
                if (value < 18) {
                    return `<span style="color: red;">${value}</span>`;
                }
                return `<span style="color: green;">${value}</span>`;
            },
        },
        {
            colName: 'Action',
            field: 'id',
            formatter: function (value, row) {
                // Create button with id in data attribute
                return $('<button>')
                    .addClass('btn btn-sm btn-primary')
                    .text('Edit')
                    .attr('data-id', value)
                    .on('click', () => alert('Edit ID: ' + value));
            },
        },
        { colName: 'Name', field: 'name' },
        {
            colName: 'Age',
            field: 'age',
            formatter: function (value) {
                // Color age: red if under 18, green otherwise
                if (value < 18) {
                    return `<span style="color: red;">${value}</span>`;
                }
                return `<span style="color: green;">${value}</span>`;
            },
        },
        {
            colName: 'Action',
            field: 'id',
            formatter: function (value, row) {
                // Create button with id in data attribute
                return $('<button>')
                    .addClass('btn btn-sm btn-primary')
                    .text('Edit')
                    .attr('data-id', value)
                    .on('click', () => alert('Edit ID: ' + value));
            },
        },
        { colName: 'Name', field: 'name' },
        {
            colName: 'Age',
            field: 'age',
            formatter: function (value) {
                // Color age: red if under 18, green otherwise
                if (value < 18) {
                    return `<span style="color: red;">${value}</span>`;
                }
                return `<span style="color: green;">${value}</span>`;
            },
        },
        {
            colName: 'Action',
            field: 'id',
            formatter: function (value, row) {
                // Create button with id in data attribute
                return $('<button>')
                    .addClass('btn btn-sm btn-primary')
                    .text('Edit')
                    .attr('data-id', value)
                    .on('click', () => alert('Edit ID: ' + value));
            },
        },
        { colName: 'Name', field: 'name' },
        {
            colName: 'Age',
            field: 'age',
            formatter: function (value) {
                // Color age: red if under 18, green otherwise
                if (value < 18) {
                    return `<span style="color: red;">${value}</span>`;
                }
                return `<span style="color: green;">${value}</span>`;
            },
        },
        {
            colName: 'Action',
            field: 'id',
            formatter: function (value, row) {
                // Create button with id in data attribute
                return $('<button>')
                    .addClass('btn btn-sm btn-primary')
                    .text('Edit')
                    .attr('data-id', value)
                    .on('click', () => alert('Edit ID: ' + value));
            },
        },
    ];

    const data = [
        { name: 'Alice', age: 15, id: 1 },
        { name: 'Bob', age: 25, id: 2 },
        { name: 'Carol', age: 30, id: 3 },
    ];
    createBootstrapTableFromObjects({ containerSelector: '#dynamic-table-container', columns, data });

    /**
     * Create bootstrap table with support for custom formatters per column.
     */
    function createBootstrapTableFromObjects(ops = {}) {
        let def = {
            containerSelector: null,
            columns: [],
            data: [],
        };
        ops = $.extend(true, def, ops);
        const $container = $(ops.containerSelector);
        $container.empty();

        const $table = $('<table class="table table-bordered"></table>');
        const $thead = $('<thead><tr></tr></thead>');
        const $tbody = $('<tbody></tbody>');

        // Build table headers with sticky first column
        ops.columns.forEach((col, index) => {
            const thClass = index === 0 ? 'position-sticky start-0 bg-light' : '';
            const $th = $('<th></th>').addClass(thClass);
            $th.append(col.colName);

            $thead.find('tr').append($th); // Append the header to the row
        });

        // Build rows
        ops.data.forEach((row) => {
            const $tr = $('<tr></tr>');
            ops.columns.forEach((col, index) => {
                const tdClass = index === 0 ? 'position-sticky start-0 bg-light' : '';
                const $td = $('<td></td>').addClass(tdClass);

                let cellValue = row[col.field];

                // Apply formatter if exists
                if (typeof col.formatter === 'function') {
                    cellValue = col.formatter(cellValue, row);
                }

                // Add content depending on type
                if (cellValue instanceof jQuery) {
                    $td.append(cellValue);
                } else if (typeof cellValue === 'string' && cellValue.trim().startsWith('<')) {
                    $td.html(cellValue);
                } else if (cellValue !== undefined && cellValue !== null) {
                    $td.text(cellValue);
                } else {
                    $td.text('');
                }

                $tr.append($td);
            });
            $tbody.append($tr);
        });

        $table.append($thead).append($tbody);
        $container.append($table);
    }
};

// <editor-fold defaultstate="collapsed" desc=" multi_tab_table1 ">
//#region multi_tab_table1
let multi_tab_table1 = () => {
    let tableId = 'multiTab-table1';
    const tableContainer = '.multiTab-table-container1';
    const pageId = 'multiTab-local';

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,
        iTr_masterFilterClear_ops: {
            exceptions: [],
        },
        pageId,
        DefaultHiddenColumns: [], // To activate this option
        //        fTbl_format : "TMPL_tbl_toolbars_f01",
        //        fTbl_controlers : {
        //            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tbl_multy_purps':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblColVisibility':{"c": "me-2"}},{'tblExport':{"c": "me-2"}},{'tblSettings':{"c": ""}}]
        //        },
        tbl_toolbar: {
            tmpl_name: 'readEdit_sColVExp',
            axns: {
                edit_remove: ['.duplicate-row-btn', '.delete-row-btn'],
                el_w: '#TMPLs_iTr_pwd_set',
                single_select: { els: ['.pwd-set_single_select'] },
                multi_select: { els: ['.pwd-set_multi_select'] },
                //   "multi_purps": {els: [".pwd-set_multiP"]}
            },
        },
        TabulatorInitOptions: {
            renderVerticalBuffer: 10000,
            no_record: 'test msg',
            tableStatusMessage:
                '<div">use vertical line at the right side of dropdown to resize the menu use vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menu<div>',
            sortOrder: [
                {},
                { is_row_selected: false, is_disabled: false }, // Not selected
                { is_row_selected: true },
                { is_disabled: true },
            ],
            iTr_expand_multi_rows: true,
            iTr_showSortingBadgeNumber: true,
            iTr_multi_row_select_disable: false,
            iTr_run_before_creatingTr: () => {
                console.log('working');
            },

            ajaxURL: 'php/iDBcode.php',
            // ajaxURL: 'https://dev1a.ai-rgus.com/php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php',
            rowHeight: 40,
            sortMode: 'local',
            filterMode: 'local',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            pagination: false,
            height: `${$('.table_w').height() - 189}px`, // we do not yet have the real table position or the table header element

            //  We do not use this option as it create other issue. We manage these thing ourself by creating custom checkbox and it's state
            //            selectableRows:true,
            //                rowHeader: {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
            //                    rowRange:"active" //only toggle the values of the active filtered rows
            //                }, hozAlign:"center", headerSort:false},

            iTr_ajaxResponse: function (url, params, response) {
                // this.AdditionalTabulatorInitOptions.preProcessData(this, response);
                //                iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
                return response['dbRows'];
            },
            iTr_add_new_row_before: function (fieldData) {
                // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
                fieldData.chbox = 1;
                fieldData.chbox2 = 0;
                fieldData.name = 'New Data';
                return true;
            },
            iTr_row_save_after: function (newData) {
                // $.ajax({
                //     method: 'POST',
                //     url: 'php/update-user.php',
                //     dataType: 'json',
                //     headers: {
                //         csrftoken: _userStr,
                //     },
                //     contentType: 'application/json; charset=utf-8',
                //     data: JSON.stringify(newData),
                // }).done((res) => {
                //     if (res.success == 1) {
                //         CustomTabulator.updateRowStatus();
                //     } else {
                //         alert(res.data?.error || 'Something went wrong');
                //     }
                // });
                CustomTabulator.updateRowStatus();
            },

            printRowRange: 'all',

            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region columnsObj
            columnsObj: function () {
                return [
                    {
                        field: 'rowExpand',
                        expandTo: expandRowWithNestedTable_Level1,
                        // expandTblHeight_style : "height:800px !important",
                        expandToKeyData: 'gender',
                        formatterParams: {
                            onRowExpand: (e, row) => {
                                console.log('opened', e, row);
                            },
                            onRowCollapse: (e, row) => {
                                console.log('closed', e, row);
                            },
                        },
                    },
                    {
                        field: 'rowSelection',
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iTr_exp_attr: {
                            exp_data_enums: { '': ' - ' },
                        },
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        hozAlign: 'center',
                        ...this.select_cell_FormatEditExport_manager({
                            map_el_class_by_val: { [-2]: 'iWifi' },
                            classNames: { [-1]: 'fas fa-check-double' },
                            dropdownOptions: {
                                // none : {v: "", t: "-", r_v: null},  // v is the elementvalue,r_v is the value to return once selected
                                none: { v: '', t: '-' }, // v is the elementvalue   if it is == "exclude-me" then we will exlude this option
                                opt1: { v: 0, t: 'No' },
                                opt2: { v: 1, t: 'Yes' },
                                opt3: { v: -1, t: 'Yes111' },
                                opt4: { v: '-2', t: 'wifi1' },
                            },
                            exp_data_enums: { '': ' - ', 0: 'No', 1: 'Yes', [-1]: 'Yes111' },
                        }),
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
                        //                        field_1: 'isCurrentRow',
                        //                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function () {
                                success($(this).val());
                            });

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Name',
                        field: 'name',
                        visible: false,
                        minWidth: 200,
                        headerFilter: true,
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        sorter: function (a, b, aRow, bRow, column) {
                            return a.localeCompare(b);
                        },
                        formatter: this.iTr_cell_editor_formatterEl,
                        formatterParams: {
                            iTr_add_new_data: true,
                            iTr_dropdown: true,
                            iTr_dropdown_type: 'button',
                            iDropdown_getlist: () => {
                                return [
                                    { label: 'Red', value: 'Red' },
                                    { label: 'Green', value: 'Green' },
                                    { label: 'Pink', value: 'Pink' },
                                    { label: 'Yellow', value: 'Yellow' },
                                    { label: 'Mauv', value: 'Mauv' },
                                    { label: 'Khaki', value: 'Khaki' },
                                    { label: 'Violet', value: 'Violet' },
                                    { label: 'Indigo', value: 'Indigo' },
                                    { label: 'Crimson', value: 'Crimson' },
                                    { label: 'Goldenrod', value: 'Goldenrod' },
                                ];
                            },
                            label: 'label',
                            iTr_dropdown_ops: {
                                dd_el_w: { class: 'w-100' },
                                dd_calling_btn: { class: 'dd_arrow_end text-start py-1 w-100', reseizable: true },
                            },
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,
                        formatterParams: {
                            iTr_add_new_data: true,
                            iTr_dropdown: true,
                            iTr_dropdown_type: 'button',
                            iDropdown_getlist: () => {
                                return [
                                    { label: 'Red', value: 'Red' },
                                    { label: 'Green', value: 'Green' },
                                    { label: 'Pink', value: 'Pink' },
                                    { label: 'Yellow', value: 'Yellow' },
                                    { label: 'Mauv', value: 'Mauv' },
                                    { label: 'Khaki', value: 'Khaki' },
                                    { label: 'Violet', value: 'Violet' },
                                    { label: 'Indigo', value: 'Indigo' },
                                    { label: 'Crimson', value: 'Crimson' },
                                    { label: 'Goldenrod', value: 'Goldenrod' },
                                ];
                            },
                            // label: 'name',
                            // value: 'name',
                            label: 'label',
                            // value: 'value',
                            iTr_dropdown_ops: {
                                dd_el_w: { class: 'w-100' },
                                dd_calling_btn: { class: 'dd_arrow_end text-start py-1 w-100', reseizable: true },
                            },
                        },
                        iTr_headerFilter_by_ddFilter: {
                            type: 'multi-checkbox',
                        },
                        cellMouseEnter: function (event, cell) {
                            CustomTabulator.iTr_zoom_or_edit({}, 'MouseEnter', event, cell);
                        },
                        //                         cellMouseLeave: function (event, cell) {
                        //                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
                        //                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit(
                                { popo_z: { class: 'mb-0 close_on_scroll', style: 'background-color: #e7e7e9;' } },
                                'DblClick',
                                event,
                                cell
                            );
                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter: 'input',
                        width: 250,
                        // iTr_headerFilter_by_ddFilter: {type: 'button'},
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: false,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter: (cell, onRendered, success, cancel) => {
                            // onRendered()
                            // success()
                            // we are getting the table data empty because data is not loaded.
                            // that is why its logic is added in tableBuilt event for the tabulator.
                            const div = $(`<div class="location_header_select"></div>`);
                            return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="gender_header_select"></div>`);
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'gender-list');
                                $(input).prop('name', 'gender');
                                $(input).prop('id', 'gender');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                        // iTr_pdf_export_col_styles:{
                        //     cellWidth: 60
                        // },
                        iTr_pdf_accessorDownload: function (data) {
                            if (data.gender == 'male') {
                                data.gender = '1';
                            } else {
                                data.gender = '0';
                            }
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        // headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        // formatter: this.iTr_cell_date_editor_formatterEl,

                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                        // ...this.iTr_cell_date_wrapper('datetime-local')
                        ...this.iTr_cell_date_wrapper('time'),
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        iTr_exp_attr: {
                            iTr_exp_col_handler: (colDef, rowData, idx, headers, row_data, colStyles, type) => {
                                let cellVal = rowData.pwd_strength;

                                if (cellVal !== '-') {
                                    let map = {
                                        from: ['tPWD_uc', 'tPWD_lc', 'tPWD_nr', 'tPWD_sm'],
                                        to: ['[ABC]', '[abc]', '[123]', '[@#$]'],
                                    };

                                    const pwdStrength = rowData.pwd_strength;
                                    for (const key in pwdStrength) {
                                        if (pwdStrength.hasOwnProperty(key)) {
                                            // console.log(`${key}: ${pwdStrength[key]}`);

                                            if (cellVal[key] == 1) {
                                                if (type === 'EXCEL') {
                                                    row_data[key] = key.iString_replace_by_array(map.from, map.to);
                                                } else {
                                                    row_data.push(key.iString_replace_by_array(map.from, map.to));
                                                }
                                            } else {
                                                if (type === 'EXCEL') {
                                                    row_data[key] = '';
                                                } else {
                                                    row_data.push('');
                                                }
                                            }
                                            if (idx === 0) {
                                                headers.push({
                                                    title: key.iString_replace_by_array(map.from, map.to),
                                                    field: colDef.field,
                                                });
                                                if (type === 'EXCEL') {
                                                    if (colDef?.iTr_exp_attr?.EXCEL?.style) {
                                                        colStyles[headers.length - 1] = colDef.iTr_exp_attr.EXCEL.style;
                                                    }
                                                } else {
                                                    if (colDef?.iTr_exp_attr?.PDF?.style) {
                                                        colStyles[headers.length - 1] = colDef.iTr_exp_attr.PDF.style;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            PDF: {
                                style: { cellWidth: 50, fillColor: 'red', textColor: 255 },
                            },
                            EXCEL: {
                                style: { wpx: 100 },
                            },
                        },
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 350,
                        print: false,
                        download: false,
                        headerSort: false,
                    },
                ];
            },
            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -iTr_rowFormatter_ before|after
            // iTr_row_formatter_before: function (row) {
            //     //                iConsole("------------ Table obj's rowFormatter Before ------------  ");

            //     var data = row.getData();
            //     //                if(data.isCurrentRow?.edit_mode || data.isCurrentRow?.edit_mode)
            //     $(row.getElement()).attr('data-location', data.location);

            //     if (data.location == 'India') {
            //         row.getCell('location').getElement().style.color = 'blue';
            //     }
            //     if (data.location == 'China') {
            //         $(row.getElement()).addClass('china');

            //         // add custom html to the cell
            //         row.getCell('location').getElement().innerHTML = `<a href='google.com'>${data.location}</a>`;
            //     }

            //     if (row.getData().isCurrentRow?.edit_mode) {
            //         $(row.getElement()).removeClass('china');
            //     }

            //     return true;
            // },
            // iTr_row_formatter_after: function (row) {
            //     if (row.getData().is_disabled) {
            //         $(row.getElement()).addClass('disable-row');
            //     }
            //     return true;
            //     //                iConsole("------------ Table obj's rowFormatter After ------------  ");
            // },

            //#endregion
            // </editor-fold>
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Print'],
            // do_not_export_fields:["rowExpand", 'name',"__dummy__", "__dummy_front__"],
            isOEM: 10,
            sort: { name: 1, email: -1 },
            pdf: {
                fileName: 'test222',
                // exp_pdf_styles: (data, column, value, doc) => {
                //     if (data.section === 'head') {
                //         data.cell.styles.fillColor = '#0d6efd';
                //     }
                // }
                // #0d6efd
            },
            excel: {
                fileName: 'test',
                whorkSheetName: 'sheet22',
                headerTextAlign: 'right',
                rowTextAlign: 'left',
            },
            print: {
                // fileName: 'test',
                // printHeader: function () {
                //     return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
                // },
                // printFormatter: (tableHolder, table) => {
                //     $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                //     $(table).find('thead th').css({ 'font-size': '11px' });
                //     $(table).find('tbody td').css({ 'font-size': '12px' });
                // },
                // printFooter: function () {
                //     // Part of Print, will be the last printed line at the last page.
                //     const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');
                //     return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                //         <div class="d-flex gap-2">
                //             <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                //             <span class='fs-6'>${timeStamp} ****</span>
                //         </div>
                //     </div>`;
                // },
            },
            handlers: {
                /* pdf: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    const { jsPDF } = window.jspdf;
                    const HiddenCols = getHiddenCols.call(currentThis);
                    const colsToExclude = ["rowSelection", "__dummy__", "ips", "fPerm", "rpar"];

                    const data = currentThis                    
                        .getData()
                        .map((row) => {
                            // delete rowSelection column
//                            delete row.rowSelection;
                            colsToExclude.reduce((obj, key) => (delete obj[key], obj), row);
                            Object.keys(row).forEach((key) => {
                                if (HiddenCols.includes(key)) {
                                    delete row[key];
                                }
                            });
                            if (row.gender) {
                                if (row.gender == 'male') {
                                    row.gender = `1`;
                                }
                                if (row.gender == 'female') {
                                    row.gender = `2`;
                                }
                            }
                            return row;
                        })
                        .map((row) => Object.values(row));

                    // Define columns             
                    const columnStyles = {};
                    let ii = 0;
                    const columns = currentThis
                        .getColumns()
                        .map((col) => {
                            if (col.isVisible() && !colsToExclude.includes(col.getField())){
                                columnStyles[ii++] = { cellWidth: col.getDefinition().width > 15? 15 : col.getDefinition().width };     // set colum's width
                                return col.getDefinition();
                            } else {
                                return null;
                            }
                        }
                    );
//                        .filter((col) => col != null && col?.field != 'rowSelection');

                    let pOpts = { orientation: 'landscape', unit: 'mm', format: 'Letter'};
                    // First pass: Create a temporary document to get the total page count
                    const tempDoc = new jsPDF(pOpts);
                    tempDoc.autoTable({
                        head: [columns],
                        body: data,
                        startY: 0,
                    });
                    const totalPages = tempDoc.internal.getNumberOfPages();

                    // Second pass: Create the final document with footer
                    const finalDoc = new jsPDF(pOpts);

                    const pageDimensions = finalDoc.internal.pageSize;
                    const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
                    const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();

                    finalDoc.autoTable({
                        head: [columns],
                        body: data,
                        columnStyles: columnStyles,
                        styles: { fontSize: 7 },
                        startY: 14,
//                        didDrawPage: async function (data) {
                        didDrawPage: function (data) {
                            const { left: leftMargin, right: rightMargin } = data.settings.margin;
                            const timeStamp = getCurrentTimestamp();

                            // add header
                            finalDoc.setFontSize(10);
                            const headerText = 'Clients Report';
                            const headerWidth = finalDoc.getTextWidth(headerText);
                            finalDoc.text(headerText, pageWidth / 2 - headerWidth / 2, 8);

                            // left part of the footer
                            let x;
                            let y;
                            let bottomY = pageHeight - 10;

                            const textWidth = finalDoc.getTextWidth('Powered by');

                            finalDoc.text('Powered by', leftMargin, bottomY);
                            finalDoc.setTextColor(blueColor);

                            const linkWidth = finalDoc.textWithLink('Ai-RGUS.com', (x = leftMargin + textWidth + 1), bottomY, {
                                url: 'https://ai-rgus.com/home',
                            });
                            finalDoc.setDrawColor(blueColor);
                            finalDoc.setLineWidth(0.2);
                            finalDoc.line(x, (y = pageHeight - 9), x + linkWidth, y);

                            finalDoc.setTextColor('#000');
                            finalDoc.text(timeStamp, x + linkWidth + 2, bottomY);

                            // right part of footer
                            const pageNoWidth = finalDoc.getTextWidth('Page ' + data.pageNumber + ' of ' + totalPages);
                            finalDoc.text(
                                'Page ' + data.pageNumber + ' of ' + totalPages,
                                pageWidth - pageNoWidth - rightMargin,
                                pageHeight - 10
                            );
                        },
                    }); 

                    finalDoc.save('clients.pdf');
                }, */
                excel: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait',
                    });
                },
                print: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.print(false, true, {});
                },
            },
        },
        //#endregion
        // </editor-fold>
    }); // +info+ adding to global object to access it from developer tools and anywhere else in the code for debugging
};
//#endregion
// </editor-fold>

let multi_tab_table2 = () => {
    let tableId = 'multiTab-table2';
    const tableContainer = '.multiTab-table-container2';
    const pageId = 'multiTab-local';
    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,
        iTr_masterFilterClear_ops: {
            exceptions: [],
        },
        pageId,
        DefaultHiddenColumns: [], // To activate this option
        //        fTbl_format : "TMPL_tbl_toolbars_f01",
        //        fTbl_controlers : {
        //            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tbl_multy_purps':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblColVisibility':{"c": "me-2"}},{'tblExport':{"c": "me-2"}},{'tblSettings':{"c": ""}}]
        //        },
        tbl_toolbar: {
            tmpl_name: 'readEdit_sColVExp',
            axns: {
                edit_remove: ['.duplicate-row-btn', '.delete-row-btn'],
                el_w: '#TMPLs_iTr_pwd_set',
                single_select: { els: ['.pwd-set_single_select'] },
                multi_select: { els: ['.pwd-set_multi_select'] },
                //   "multi_purps": {els: [".pwd-set_multiP"]}
            },
        },
        TabulatorInitOptions: {
            renderVerticalBuffer: 10000,
            no_record: 'test msg',
            tableStatusMessage:
                '<div">use vertical line at the right side of dropdown to resize the menu use vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menuuse vertical line at the right side of dropdown to resize the menu<div>',
            sortOrder: [
                {},
                { is_row_selected: false, is_disabled: false }, // Not selected
                { is_row_selected: true },
                { is_disabled: true },
            ],
            iTr_expand_multi_rows: true,
            iTr_showSortingBadgeNumber: true,
            iTr_multi_row_select_disable: false,
            iTr_run_before_creatingTr: () => {
                console.log('working');
            },

            ajaxURL: 'php/iDBcode.php',
            // ajaxURL: 'https://dev1a.ai-rgus.com/php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php',
            rowHeight: 40,
            sortMode: 'local',
            filterMode: 'local',
            keybindings: {
                scrollToStart: false,
                scrollToEnd: false,
            },
            pagination: false,
            height: `${$('.table_w').height() - 189}px`, // we do not yet have the real table position or the table header element

            //  We do not use this option as it create other issue. We manage these thing ourself by creating custom checkbox and it's state
            //            selectableRows:true,
            //                rowHeader: {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
            //                    rowRange:"active" //only toggle the values of the active filtered rows
            //                }, hozAlign:"center", headerSort:false},

            iTr_ajaxResponse: function (url, params, response) {
                // this.AdditionalTabulatorInitOptions.preProcessData(this, response);
                //                iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
                return response['dbRows'];
            },
            iTr_add_new_row_before: function (fieldData) {
                // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
                fieldData.chbox = 1;
                fieldData.chbox2 = 0;
                fieldData.name = 'New Data';
                return true;
            },
            iTr_row_save_after: function (newData) {
                // $.ajax({
                //     method: 'POST',
                //     url: 'php/update-user.php',
                //     dataType: 'json',
                //     headers: {
                //         csrftoken: _userStr,
                //     },
                //     contentType: 'application/json; charset=utf-8',
                //     data: JSON.stringify(newData),
                // }).done((res) => {
                //     if (res.success == 1) {
                //         CustomTabulator.updateRowStatus();
                //     } else {
                //         alert(res.data?.error || 'Something went wrong');
                //     }
                // });
                CustomTabulator.updateRowStatus();
            },

            printRowRange: 'all',

            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region columnsObj
            columnsObj: function () {
                return [
                    {
                        field: 'rowExpand',
                        expandTo: expandRowWithNestedTable_Level1,
                        // expandTblHeight_style : "height:800px !important",
                        expandToKeyData: 'gender',
                        formatterParams: {
                            onRowExpand: (e, row) => {
                                console.log('opened', e, row);
                            },
                            onRowCollapse: (e, row) => {
                                console.log('closed', e, row);
                            },
                        },
                    },
                    {
                        field: 'rowSelection',
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        hozAlign: 'center',
                        ...this.select_cell_FormatEditExport_manager({
                            map_el_class_by_val: { [-2]: 'iWifi' },
                            classNames: { [-1]: 'fas fa-check-double' },
                            dropdownOptions: {
                                // none : {v: "", t: "-", r_v: null},  // v is the elementvalue,r_v is the value to return once selected
                                none: { v: '', t: '-' }, // v is the elementvalue   if it is == "exclude-me" then we will exlude this option
                                opt1: { v: 0, t: 'No' },
                                opt2: { v: 1, t: 'Yes' },
                                opt3: { v: -1, t: 'Yes111' },
                                opt4: { v: '-2', t: 'wifi1' },
                            },
                            exp_data_enums: { 0: 'No', 1: 'Yes', [-1]: 'Yes111' },
                        }),
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
                        //                        field_1: 'isCurrentRow',
                        //                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_select_cell_getEl(cell, onRendered, {
                                TMPL_el_class: 'form-select-sm',
                            });

                            function onSuccess() {
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);

                            return selectContainer[0];
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function () {
                                success($(this).val());
                            });

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                return CustomTabulator.iTr_select_cell_getEl(cell, onRendered)[0];
                            } else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }
                        },
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Name',
                        field: 'name',
                        visible: false,
                        minWidth: 200,
                        headerFilter: true,
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        sorter: function (a, b, aRow, bRow, column) {
                            return a.localeCompare(b);
                        },
                        formatter: this.iTr_cell_editor_formatterEl,
                        formatterParams: {
                            iTr_add_new_data: true,
                            iTr_dropdown: true,
                            iTr_dropdown_type: 'button',
                            iDropdown_getlist: () => {
                                return [
                                    { label: 'Red', value: 'Red' },
                                    { label: 'Green', value: 'Green' },
                                    { label: 'Pink', value: 'Pink' },
                                    { label: 'Yellow', value: 'Yellow' },
                                    { label: 'Mauv', value: 'Mauv' },
                                    { label: 'Khaki', value: 'Khaki' },
                                    { label: 'Violet', value: 'Violet' },
                                    { label: 'Indigo', value: 'Indigo' },
                                    { label: 'Crimson', value: 'Crimson' },
                                    { label: 'Goldenrod', value: 'Goldenrod' },
                                ];
                            },
                            label: 'label',
                            iTr_dropdown_ops: {
                                dd_el_w: { class: 'w-100' },
                                dd_calling_btn: { class: 'dd_arrow_end text-start py-1 w-100', reseizable: true },
                            },
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,
                        formatterParams: {
                            iTr_add_new_data: true,
                            iTr_dropdown: true,
                            iTr_dropdown_type: 'button',
                            iDropdown_getlist: () => {
                                return [
                                    { label: 'Red', value: 'Red' },
                                    { label: 'Green', value: 'Green' },
                                    { label: 'Pink', value: 'Pink' },
                                    { label: 'Yellow', value: 'Yellow' },
                                    { label: 'Mauv', value: 'Mauv' },
                                    { label: 'Khaki', value: 'Khaki' },
                                    { label: 'Violet', value: 'Violet' },
                                    { label: 'Indigo', value: 'Indigo' },
                                    { label: 'Crimson', value: 'Crimson' },
                                    { label: 'Goldenrod', value: 'Goldenrod' },
                                ];
                            },
                            // label: 'name',
                            // value: 'name',
                            label: 'label',
                            // value: 'value',
                            iTr_dropdown_ops: {
                                dd_el_w: { class: 'w-100' },
                                dd_calling_btn: { class: 'dd_arrow_end text-start py-1 w-100', reseizable: true },
                            },
                        },
                        iTr_headerFilter_by_ddFilter: {
                            type: 'multi-checkbox',
                        },
                        cellMouseEnter: function (event, cell) {
                            CustomTabulator.iTr_zoom_or_edit({}, 'MouseEnter', event, cell);
                        },
                        //                         cellMouseLeave: function (event, cell) {
                        //                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
                        //                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit(
                                { popo_z: { class: 'mb-0 close_on_scroll', style: 'background-color: #e7e7e9;' } },
                                'DblClick',
                                event,
                                cell
                            );
                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter: 'input',
                        width: 250,
                        // iTr_headerFilter_by_ddFilter: {type: 'button'},
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: false,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter: (cell, onRendered, success, cancel) => {
                            // onRendered()
                            // success()
                            // we are getting the table data empty because data is not loaded.
                            // that is why its logic is added in tableBuilt event for the tabulator.
                            const div = $(`<div class="location_header_select"></div>`);
                            return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter: (cell, onRendered, success, cancel) => {
                            const div = $(`<div class="gender_header_select"></div>`);
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                            if (editMode) {
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr('list', 'gender-list');
                                $(input).prop('name', 'gender');
                                $(input).prop('id', 'gender');

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);

                                return editor;
                            }
                            return cell.getValue();
                        },
                        // iTr_pdf_export_col_styles:{
                        //     cellWidth: 60
                        // },
                        iTr_pdf_accessorDownload: function (data) {
                            if (data.gender == 'male') {
                                data.gender = '1';
                            } else {
                                data.gender = '0';
                            }
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        // headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        // formatter: this.iTr_cell_date_editor_formatterEl,

                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                        // ...this.iTr_cell_date_wrapper('datetime-local')
                        ...this.iTr_cell_date_wrapper('time'),
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        iTr_exp_attr: {
                            iTr_exp_col_handler: (colDef, rowData, idx, headers, row_data, colStyles, type) => {
                                let cellVal = rowData.pwd_strength;

                                if (cellVal !== '-') {
                                    let map = {
                                        from: ['tPWD_uc', 'tPWD_lc', 'tPWD_nr', 'tPWD_sm'],
                                        to: ['[ABC]', '[abc]', '[123]', '[@#$]'],
                                    };

                                    const pwdStrength = rowData.pwd_strength;
                                    for (const key in pwdStrength) {
                                        if (pwdStrength.hasOwnProperty(key)) {
                                            // console.log(`${key}: ${pwdStrength[key]}`);

                                            if (cellVal[key] == 1) {
                                                if (type === 'EXCEL') {
                                                    row_data[key] = key.iString_replace_by_array(map.from, map.to);
                                                } else {
                                                    row_data.push(key.iString_replace_by_array(map.from, map.to));
                                                }
                                            } else {
                                                if (type === 'EXCEL') {
                                                    row_data[key] = '';
                                                } else {
                                                    row_data.push('');
                                                }
                                            }
                                            if (idx === 0) {
                                                headers.push({
                                                    title: key.iString_replace_by_array(map.from, map.to),
                                                    field: colDef.field,
                                                });
                                                if (type === 'EXCEL') {
                                                    if (colDef?.iTr_exp_attr?.EXCEL?.style) {
                                                        colStyles[headers.length - 1] = colDef.iTr_exp_attr.EXCEL.style;
                                                    }
                                                } else {
                                                    if (colDef?.iTr_exp_attr?.PDF?.style) {
                                                        colStyles[headers.length - 1] = colDef.iTr_exp_attr.PDF.style;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            PDF: {
                                style: { cellWidth: 50, fillColor: 'red', textColor: 255 },
                            },
                            EXCEL: {
                                style: { wpx: 100 },
                            },
                        },
                    },
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 350,
                        print: false,
                        download: false,
                        headerSort: false,
                    },
                ];
            },
            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -iTr_rowFormatter_ before|after
            // iTr_row_formatter_before: function (row) {
            //     //                iConsole("------------ Table obj's rowFormatter Before ------------  ");

            //     var data = row.getData();
            //     //                if(data.isCurrentRow?.edit_mode || data.isCurrentRow?.edit_mode)
            //     $(row.getElement()).attr('data-location', data.location);

            //     if (data.location == 'India') {
            //         row.getCell('location').getElement().style.color = 'blue';
            //     }
            //     if (data.location == 'China') {
            //         $(row.getElement()).addClass('china');

            //         // add custom html to the cell
            //         row.getCell('location').getElement().innerHTML = `<a href='google.com'>${data.location}</a>`;
            //     }

            //     if (row.getData().isCurrentRow?.edit_mode) {
            //         $(row.getElement()).removeClass('china');
            //     }

            //     return true;
            // },
            // iTr_row_formatter_after: function (row) {
            //     if (row.getData().is_disabled) {
            //         $(row.getElement()).addClass('disable-row');
            //     }
            //     return true;
            //     //                iConsole("------------ Table obj's rowFormatter After ------------  ");
            // },

            //#endregion
            // </editor-fold>
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Print'],
            // do_not_export_fields:["rowExpand", 'name',"__dummy__", "__dummy_front__"],
            isOEM: 10,
            sort: { name: 1, email: -1 },
            pdf: {
                fileName: 'test222',
                // exp_pdf_styles: (data, column, value, doc) => {
                //     if (data.section === 'head') {
                //         data.cell.styles.fillColor = '#0d6efd';
                //     }
                // }
                // #0d6efd
            },
            excel: {
                fileName: 'test',
                whorkSheetName: 'sheet22',
                headerTextAlign: 'right',
                rowTextAlign: 'left',
            },
            print: {
                // fileName: 'test',
                // printHeader: function () {
                //     return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
                // },
                // printFormatter: (tableHolder, table) => {
                //     $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                //     $(table).find('thead th').css({ 'font-size': '11px' });
                //     $(table).find('tbody td').css({ 'font-size': '12px' });
                // },
                // printFooter: function () {
                //     // Part of Print, will be the last printed line at the last page.
                //     const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');
                //     return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                //         <div class="d-flex gap-2">
                //             <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                //             <span class='fs-6'>${timeStamp} ****</span>
                //         </div>
                //     </div>`;
                // },
            },
            handlers: {
                /* pdf: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    const { jsPDF } = window.jspdf;
                    const HiddenCols = getHiddenCols.call(currentThis);
                    const colsToExclude = ["rowSelection", "__dummy__", "ips", "fPerm", "rpar"];

                    const data = currentThis                    
                        .getData()
                        .map((row) => {
                            // delete rowSelection column
//                            delete row.rowSelection;
                            colsToExclude.reduce((obj, key) => (delete obj[key], obj), row);
                            Object.keys(row).forEach((key) => {
                                if (HiddenCols.includes(key)) {
                                    delete row[key];
                                }
                            });
                            if (row.gender) {
                                if (row.gender == 'male') {
                                    row.gender = `1`;
                                }
                                if (row.gender == 'female') {
                                    row.gender = `2`;
                                }
                            }
                            return row;
                        })
                        .map((row) => Object.values(row));

                    // Define columns             
                    const columnStyles = {};
                    let ii = 0;
                    const columns = currentThis
                        .getColumns()
                        .map((col) => {
                            if (col.isVisible() && !colsToExclude.includes(col.getField())){
                                columnStyles[ii++] = { cellWidth: col.getDefinition().width > 15? 15 : col.getDefinition().width };     // set colum's width
                                return col.getDefinition();
                            } else {
                                return null;
                            }
                        }
                    );
//                        .filter((col) => col != null && col?.field != 'rowSelection');

                    let pOpts = { orientation: 'landscape', unit: 'mm', format: 'Letter'};
                    // First pass: Create a temporary document to get the total page count
                    const tempDoc = new jsPDF(pOpts);
                    tempDoc.autoTable({
                        head: [columns],
                        body: data,
                        startY: 0,
                    });
                    const totalPages = tempDoc.internal.getNumberOfPages();

                    // Second pass: Create the final document with footer
                    const finalDoc = new jsPDF(pOpts);

                    const pageDimensions = finalDoc.internal.pageSize;
                    const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
                    const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();

                    finalDoc.autoTable({
                        head: [columns],
                        body: data,
                        columnStyles: columnStyles,
                        styles: { fontSize: 7 },
                        startY: 14,
//                        didDrawPage: async function (data) {
                        didDrawPage: function (data) {
                            const { left: leftMargin, right: rightMargin } = data.settings.margin;
                            const timeStamp = getCurrentTimestamp();

                            // add header
                            finalDoc.setFontSize(10);
                            const headerText = 'Clients Report';
                            const headerWidth = finalDoc.getTextWidth(headerText);
                            finalDoc.text(headerText, pageWidth / 2 - headerWidth / 2, 8);

                            // left part of the footer
                            let x;
                            let y;
                            let bottomY = pageHeight - 10;

                            const textWidth = finalDoc.getTextWidth('Powered by');

                            finalDoc.text('Powered by', leftMargin, bottomY);
                            finalDoc.setTextColor(blueColor);

                            const linkWidth = finalDoc.textWithLink('Ai-RGUS.com', (x = leftMargin + textWidth + 1), bottomY, {
                                url: 'https://ai-rgus.com/home',
                            });
                            finalDoc.setDrawColor(blueColor);
                            finalDoc.setLineWidth(0.2);
                            finalDoc.line(x, (y = pageHeight - 9), x + linkWidth, y);

                            finalDoc.setTextColor('#000');
                            finalDoc.text(timeStamp, x + linkWidth + 2, bottomY);

                            // right part of footer
                            const pageNoWidth = finalDoc.getTextWidth('Page ' + data.pageNumber + ' of ' + totalPages);
                            finalDoc.text(
                                'Page ' + data.pageNumber + ' of ' + totalPages,
                                pageWidth - pageNoWidth - rightMargin,
                                pageHeight - 10
                            );
                        },
                    }); 

                    finalDoc.save('clients.pdf');
                }, */
                excel: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait',
                    });
                },
                print: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.print(false, true, {});
                },
            },
        },
        //#endregion
        // </editor-fold>
    });
    window.iTr_irLocal = CustomTabulator;
};

let __AGS__ = '<span class="text-nowrap skiptranslate"><span class="airgusEl">A<span class="i_tx">i-</span>rgus</span></span>';
let __isOEM__ = 0;
// <editor-fold defaultstate="collapsed" desc=" class : AJAX loader ">
// active it by: $("#AJAX_load").removeClass("d-none");
class _iGU_AJAX_loader {
    /*
     * Use this attributes to cutumize the loader element:
     *      - ldr_class to add a class
     *      - attrToCss to set the css of the element using _iGUutls.attr_to_css function
     * Using the _iGUAJAX_loader.show_loader() and you do not see the loader?
     * 1. change the delay to 0. (in the calling to insi. the class)
     * 2. call to the show_loader() first and then, put all the JS "havy code" inside setTimeout(function(){ code... }, 50);
     */
    constructor(a) {
        let defaults = {
            // do NOT include keyword var ;  you want to access defaults inside the $.each()
            l_el: __AGS__ || "<span class='skiptranslate text-nowrap'><span>Loading...</span></span>",
            delay: 700,
            c: null, // class toggle
            css: {},
            zInx: true,
        };
        this.a = $.extend(true, {}, defaults, a);

        let l_el = __isOEM__ ? $(__ARG_main__) : $(this['a']['l_el']);

        if (!__isOEM__) {
            $('.airgusEl', l_el).addClass('bg-logo-bg html_AGS_logo_col px-3').css({ 'font-size': '4rem' });
            this['a']['l_el'] =
                $(l_el).prop('outerHTML') +
                `<div class="extrText">No camera left behind<i class="far fa-registered h7 position-relative" style="left:2px; top:-10px"></i></div>`;
        } else {
            $(l_el).addClass(`bg-logo-bg ${$(l_el).attr('ldr_class')}`);
            _iGUutls.attr_to_css($(l_el));
            this['a']['l_el'] = $(l_el).prop('outerHTML');
        }

        // <div class="loader _NOneed___html_AGS_logo_col"><span class="align-content-around">${this["a"]["l_el"]}</span></div>
        let laoderEl = `<div id="AJAX_load" class="fixed-top h-100 w-100 d-flex justify-content-center align-items-center align-items-xl-baseline _d-none" style="background-color:#93939385; z-index: 1000;">
            <div class="row align-items-center justify-content-center h-75">
                <div class="loader"><span class="align-content-around">${this['a']['l_el']}</span></div>
            </div>
            </div>`;
        this.laoderEl_for_iTr = laoderEl;
        // $("body").append(laoderEl);

        this.set_zIndex();
        this.setAjaxLoaderDelay(this['a']['delay']);

        this.events();
    }

    events() {
        $(document).on({
            ajaxStart: function () {
                localStorage.setItem('ajax', 'started');
                setTimeout(function () {
                    if (localStorage.getItem('ajax') !== 'stop') {
                        $('#AJAX_load').removeClass('d-none');
                    }
                }, parseInt(localStorage.getItem('timeout_val')) || 0);
            },
            ajaxStop: function () {
                localStorage.setItem('ajax', 'stop');
                $('#AJAX_load').addClass('d-none');
            },
        });
    }

    setAjaxLoaderDelay(delay_amt) {
        localStorage.setItem('timeout_val', delay_amt);
    }

    toActivate(aa) {
        let dd = {
            toOn: 1,
            delyMs: 0,
            c: null,
            css: {},
        };
        aa = $.extend(true, {}, dd, aa);

        setTimeout(function () {
            $('.AJAX_modal').toggleClass(aa['c']).css(aa['css']);
            if (aa['toOn'] === 1) {
                $('#AJAX_load').removeClass('d-none');
            } else if (aa['toOn'] === 0) {
                $('#AJAX_load').addClass('d-none');
            }
        }, aa['delayMs']);
    }

    set_zIndex() {
        if (this['a']['zInx']) {
            //            let _iGUutls = new _iGU_utls();
            let zInd = 1000000; //_iGUutls.get_maxZindex() + 1;
            $('#AJAX_load').css({ 'z-index': zInd });
        }
    }

    show_loader() {
        if (this['a']['zInx']) {
            //            let _iGUutls = new _iGU_utls();
            let zInd = 100000; //_iGUutls.get_maxZindex() + 1;
            $('#AJAX_load').css({ 'z-index': zInd });
        }
        localStorage.setItem('ajax', 'started');
        setTimeout(function () {
            if (localStorage.getItem('ajax') !== 'stop') {
                $('#AJAX_load').removeClass('d-none');
            }
        }, parseInt(localStorage.getItem('timeout_val')) || 0);
    }

    hide_loader() {
        localStorage.setItem('ajax', 'stop');
        $('#AJAX_load').addClass('d-none');
    }
}
// </editor-fold>

let _iGUAJAX_loader = new _iGU_AJAX_loader();
// _webpage_loader.show_loader()
