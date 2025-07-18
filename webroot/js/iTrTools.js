CONSOLE_ON = 1;
let _TESTING_NB = window.location.hostname === 'app.lvh.me' ? 0 : 1;
let _DEV_i = window.location.host === 'localhost:8000' ? 'fa' : null;

var DEFAULT_PAGE_SIZE = 25;
var DateTime = luxon.DateTime; //+IR+ can I comment it!? check everywhere that it is working without it !!!!!!!!!!!!

// +i+ row.getTable().CustomTabulator <- Here is how to access it from any place

// <editor-fold defaultstate="collapsed" desc=" class: FeaturedTable ">
//#region -class: FeaturedTable
class FeaturedTable {
    // <editor-fold defaultstate="collapsed" desc=" initilization params ">
    //#region -  initilization params

    // +i+ To add MY-KEY and value to the tabulator obj:
    // add it to the:  TabulatorInitOptions:
    // you will find it back via the tabulator obj .options.MY-KEY-NAME

    // +i+ to access the CustomTabulator from a cell: cell.getTable().CustomTabulator.ANY-FUNCTIN_OR_ATTRIBUTE
    //      example: cell.getTable().CustomTabulator.toggleUpdateEditedRowBtn(true);

    TabulatorObj = null;
    sortCount = {};
    additionalAjaxParams = {};
    tableContainer = null;
    iTr_expTbl = false; // if True we will shrink the nested table in case there are fewer rows than the pr-defined height (= the expandt table TabulatorInitOptions: height: "250px") and there is no iTr_expTbl_MinHeight
    iTr_expTbl_parentTbl = null; // Optional. to use, incase we need access to parent(s) table(s). The way to use it; in any exp. table: iTr_expTbl_parentTbl: row.getTable().CustomTabulator,
    iTr_expTbl_MinHeight = null; // Optional. Number, minimun height of the nested table in px. If not used the exp tbl will shrink to the neccessary height
    // the tbl max-height is based on the height value of the tabulator setting of the exp. table (= the expandt table TabulatorInitOptions: height: "250px")
    // Use this function to create the expanded table elements
    // row_expanded.getTable().CustomTabulator.iTr_expTbl_fn_expandToEl(LevelNr, row_expanded, tableId, Height);
    // LevelNr : Number, replace it with the level number start from 2
    // Height : Number, (in px) a placeholder in the parent table. It will reserve a space to place the expanded table. Use it ONLY for expansion table level 3 and higher
    // Before that the table has full height and if we use it it will shrink the the table.
    //
    // +i+ in case of scrooling issue, use it as last resort
    //     renderVerticalBuffer: 10000, use this in the  TabulatorInitOptions:

    iTr_tableBuilded = false;

    // once we click the master filter clear button, we might run other code using: run_after. The Tabulator obj. is available inside this function
    // We also might explode from clearing the filters field (s) using the exception.
    // The exclude will simply exclude this field(s) from clearing them when we click the button, and this field(s)'s filters will stay.
    // It is better to use field with visibility: false in the exclude field list - if not, the result of all combinations might be different from the expected.
    iTr_masterFilterClear_ops = { run_after: null, exception: [] };

    initMode = 'infinite-loading'; // [infinite-loading | paginated-local | paginated-remote]
    tableContainerElement = $('.infinite-table-container');
    // <editor-fold defaultstate="collapsed" desc=" table toolbar definition ">
    //#region -  initilization params
    tbl_toolbars_def = {
        read_mode: { c: '' },
        editing: { c: '' },
        multy_purps: { c: '' },
        search: { c: '', input_w: 350 },
        col_vis: { c: '' },
        export: { c: '' },
        settings: { c: '' },
        dataTree: {
            c: 'fas fa-2x fa-plus-square',
            click: () => {
                console.log('add a click function');
            },
        },
    };
    tbl_toolbar = { 'tmpl-name': '', axns: {} };
    tbl_toolbars_sColVExp = {
        search: this.tbl_toolbars_def.search,
        col_vis: this.tbl_toolbars_def.col_vis,
        export: this.tbl_toolbars_def.export,
    };
    tbl_toolbars_tmpls = {
        sColVExp: [{ ...this.tbl_toolbars_sColVExp }],
        dataTree_sColVExp: [{ dataTree: this.tbl_toolbars_def.dataTree, ...this.tbl_toolbars_sColVExp }],
        edit_sColVExp: [{ editing: this.tbl_toolbars_def.editing, ...this.tbl_toolbars_sColVExp }],
        editMultiP_sColVExp: [
            { editing: this.tbl_toolbars_def.editing, multy_purps: this.tbl_toolbars_def.multy_purps, ...this.tbl_toolbars_sColVExp },
        ],
        readEdit_sColVExp: [
            { read_mode: this.tbl_toolbars_def.read_mode, editing: this.tbl_toolbars_def.editing, ...this.tbl_toolbars_sColVExp },
        ],
    };
    //#endregion
    // </editor-fold>
    _tbl_columns_field_names_reserved = ['isCurrentRow'];
    tbl_ExpandRows = []; // stroring the expanded rows ids

    DefaultHiddenColumns = []; // ['dob', 'name']

    // html elements
    rowOperationsContainer = null;
    enableEditRowBtn = null;
    updateEditedRowBtn = null;
    discardEditedRowBtn = null;
    uploadCopiedRowsBtn = null;

    // store data when table filtering is done
    filtered_tbl_data = []; // contains row objects of the filtered data
    currentPageData = []; // for showing editing row on different pages
    currentSelectedRows = []; // storing the rows obj of the selected rows
    // tracking id for selected rows to restore
    selectedRowsSet = new Set(); // to get the row data use: tempTable.TabulatorObj.getRow([...tempTable.selectedRowsSet.values()][0]).getData()

    iTr_disabled_rows_count = 0; // counter of the disbaled rows

    // track editing the rows or not
    isEditing = false;
    // isUpdated - we are adding this to the row data to know if the row is in editing mode AND data was updated
    // is_row_selected - boolean -> using to select/deselect rows. (coming from api)
    // is_disabled - boolean -> using to disabling the rows. (coming from api)

    // additional things in column configuration
    //{
    //  iTr_pdf_export_col_styles - styling object to give column wise style to pdf
    //  iTr_pdf_accessorDownload - function to repalce the value for particular column cell when downloading to pdf.
    //
    //  used to show/hide the select-dropdown checkbox and its label from the list.
    //  as well as to exclude from export to Excel or PDF
    //  All values are optional, and we might include only the one with a value 1
    //  iExcludeFromList - object ({src:0, cv: 0, exp_excel:1, exp_pdf:1, })
    //
    //  expandToKeyData - used for nested table, when getting data and sorting the data by that key.
    //  expandTo - takes a function, which will run when clicked on expand button and opens the table for that row.
    //
    //}

    // storing column is present or not
    isRowExpandColPresent = false; // it is set automaticaly by the code
    isRowSelectionColPresent = false; // it is set automaticaly by the code
    editedRowData = null; // it is set automaticaly by the code : we use it like for paginated, to be able to show the edited row on the next page
    // storing the editing row state before it gets changed, so we can restore it when discarding the changes.
    selecteRowStates = { old_data: null }; // -> Keep the original row data from before starting to edit. It is set automatically by the code. Use for discard or when we need to get the original row data before editing

    // contains references for the unique select dropdowns present in tabulator header filter
    uniqueSelectDropdowns = {
        headerFilters: {
            // [column_name]: [dropdown_reference]
        },
    };

    AdditionalTabulatorInitOptions = {
        // list of all our table cutumizations
        // To customize it, add or change the attribute of the TabulatorInitOptions {} of any table

        // masterFilterURL: '',
        // paginationInitialPage: 1,
        // paginationSize: 25

        iTr_init_end: null, // function(FeaturedTable, $table_header_toolbar_w);
        // Run once after creating the tabulator and before getting the data

        iTr_rowSelectionCell_CustomSortOrder: null,
        // to customize, create an array similar to
        //      const sortOrder = iTrCustomSortOrder ?? [..]
        //      place it in any table definition under TabulatorInitOptions: {

        iTr_moveRowSelectionOnKeyDown: false, // used to move the row selection with arrow-left and arrow-right key
        iTr_enable_edit_row_freezing: false,
        iTr_expand_multi_rows: false, // allow to expand multi rows on a one table
        iTr_multi_row_select_disable: false,
        iTr_export_only_filtered_data: true,
        iTr_showSortingBadgeNumber: true,
        iTr_on_row_selection_zero: null, // function () {}
        iTr_on_row_selection_one: null, // function () {}
        iTr_on_row_selection_multiple: null, // function () {}

        iTr_ajaxResponse: null, // function (url, params, response) { return true; }

        iTr_add_new_row_before: null, // function (fieldData) { return true; },
        // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
        // fieldData.name = "New Data";
        iTr_add_new_row_after: null, // function (fieldData) {},

        iTr_row_delete_before: null, // function (FeaturedTable, ...fieldData) { return true }  or function (FtblObj, deleteData) { }
        iTr_row_delete_after: null, // function (deleteData) {}

        iTr_enableEditMode_start: null, // function(obj){ return true; }
        iTr_enableEditMode_end: null, // function(row){ }

        iTr_row_save_before: null, // function (FeaturedTable, ...fieldData) {
        //console.log('------------ iTr_row_save_before --------------');
        //console.log({ fieldData }, FeaturedTable);
        //return true; }
        iTr_row_save_after: null, // function (newData) { }
        iTr_row_discard_after: null, // function(row){ }

        // iTr_setEditMode is the function where we are settig all on edit/undo/save
        iTr_setEditMode_end: null, // iTr_setEditMode_end(setTo) {}

        iTr_row_duplicate_start: null, // function (newRowData, demoVar1, demoVar2) { return true; }
        iTr_row_duplicate_end: null, // function () { }

        iTr_row_formatter_before: null, // function (row) { return true; }
        iTr_row_formatter_after: null, // function (row){ }

        // function to run validations after clipboard copy pasting new-rows
        iTr_clipboard_copy_after: null,
        iTr_on_upload_row_btn_click: null,

        iTr_rowselectionChanged: null,
        iTr_cellDblClick: null, // function (event, cell) { }

        columnsObj: function () {},

        placeholder: `<div class="alert alert-warning h4 text-center rounded shadow fw-bold px-5  [ position-absolute top_n-pct start-50 translate-middle-x ]" role="alert" style="--top_n-pct:10%;">
                No data to show</div>`, // to customize it; add a placeholder under Tabulator InitOptions
        placeholderHeaderFilter: `<div class="alert alert-warning h4 text-center rounded shadow fw-bold px-5  [ position-absolute top_n-pct start-50 translate-middle-x ]" role="alert" style="--top_n-pct:20%;">
                No Matching Data</div>`,
    };

    // <editor-fold defaultstate="collapsed" desc=" COMMENT: List of the options passed when creating the Class object ">
    //#region -COMMENT: List of the options passed when creating the Class object
    // options = {
    //     tableLocalStorageKey: '',
    //     tableContainer:'',
    //     DefaultHiddenColumns: [''],
    //     iTr_init_end: function
    //     TabulatorInitOptions: object
    //     fTbl_format : "TMPL_tbl_toolbars_f01",
    //     fTbl_controlers : {
    //         "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblSettings':{"c": ""}}]
    //     },
    //     exports: {
    //         types: ['PDF', 'Excel', 'Print'],
    //     }
    // }
    //#endregion
    // </editor-fold>

    exports = {};
    localStorageKey = '';
    //    hasUserFiltered = false;

    TableSettings = {
        filter_by: {
            on_enter: { enabled: true },
            on_type: { enabled: true, input_value: 500 },
        },
        persist_column_visibility: { enabled: false, hiddenColumns: [] },
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" constructor ">
    //#region -constructor
    /**
     *
     * @param {'paginated-remote' | 'infinite-loading' | 'paginated-local'}  mode
     * @param {string}  TableId
     * @param {{title?:string, TabulatorInitOptions:  import("../types/tabulator.js").Tabulator.Options}} options
     */
    constructor(mode, TableId, options = {}) {
        // <editor-fold defaultstate="collapsed" desc=" COMMENT: How to customization input cells ">
        //#region -constructor
        /*        
        ** in columns def, the most common input field with no customization, use
        formatter: this.iTr_cell_editor_formatterEl,
        
        ** if necessary to add customization here is what is possible to use
        
        formatterParams: {
            iEl_viewMode: function(cell){
            },
            iEl_viewMode_runAndComplete: function(cell){
                return cell_val;
            },
            iEl_editMode: function($input, cell){
                let cell_val = cell.getValue();
                let cell_val_f = format the -> cell_val
                $input.val(cell_val_f);
            },
            iOnFocus: function(e, cell){
                let cell_val = e.target.value;
                let cell_val_f = format the -> cell_val
                $("input", cell.getElement()).val(cell_val_f);

            },
            iOnChange: function(e, cell){                
                let cell_val = e.target.value;
                let cell_val_f = format the -> cell_val
                  
                $("input", cell.getElement()).val(cell_val_f);
                cell.getData()[cell.getField()] = cell_val;
                cell.getData().isUpdated = true;
                return false;
            },
            iOnBlur: function(e, cell){
                let cell_val = Number(e.target.value);
                let fn = cell.getField();
                cell.getData()[fn] = num.toFixed(2);              
                return true;
            },
        },
    */
        //#endregion
        // </editor-fold>

        this.localStorageKey = `${options.tableLocalStorageKey}_tabulator_settings`;
        this.tableContainer = options.tableContainer;
        this.iTr_expTbl = options.iTr_expTbl;
        this.iTr_expTbl_MinHeight = options.iTr_expTbl_MinHeight;
        this.iTr_expTbl_parentTbl = options.iTr_expTbl_parentTbl;
        this.iTr_masterFilterClear_ops = $.extend(true, this.iTr_masterFilterClear_ops, options.iTr_masterFilterClear_ops);

        if (Store.get(this.localStorageKey)) {
            iConsole('-----------', Store.get(this.localStorageKey));
            this.TableSettings = Store.get(this.localStorageKey);
        }

        // for initializating the tabulator for 'pagination' and 'infinite-loading' mode
        this.initMode = mode; // ABBR -> initializationMode  (needed to initialize the table with different modes like <local-paginated>|<inifinite-loading>)
        this.AdditionalTabulatorInitOptions = $.extend(true, this.AdditionalTabulatorInitOptions, options.TabulatorInitOptions);

        this.exports = options.exports ?? {};
        this.DefaultHiddenColumns = options.DefaultHiddenColumns || [];
        //        this.fTbl_format = options.fTbl_format || this.fTbl_format;        //+IR+ see if we can delete this attr
        //        this.fTbl_controlers = options.fTbl_controlers?.[this.fTbl_format] ?? this.fTbl_controlers[this.fTbl_format]; //+IR+ see if we can delete this attr
        this.tbl_toolbars = options.tbl_toolbars || this.tbl_toolbars_tmpls[options?.tbl_toolbar?.tmpl_name] || [];
        this.tbl_toolbars.push(options?.tbl_toolbar?.axns || {});

        this.tableContainerElement = $(options.tableContainer);
        this.rowOperationsContainer = $('#TMPL_actions_template').find('.single-row-operations-container').clone(true);
        this.enableEditRowBtn = $(this.rowOperationsContainer).find('.enable-row-edit-btn');
        this.updateEditedRowBtn = $(this.rowOperationsContainer).find('.update-edited-row-btn');
        this.discardEditedRowBtn = $(this.rowOperationsContainer).find('.discard-edited-row-btn');
        this.duplicateRowBtn = $(this.rowOperationsContainer).find('.duplicate-row-btn');
        this.deleteRowBtn = $(this.rowOperationsContainer).find('.delete-row-btn');
        this.addNewRowBtn = $('#TMPL_add-new-row-btn').clone(true).removeAttr('id').removeClass('d-none');

        // this.iTr_columnsObj = options.TabulatorInitOptions.columnsObj;

        // operation events for table row
        $(this.addNewRowBtn).on('click', (e) => this.iHandle_addNewRowBtn(e, 'value1', 'value2'));
        $(this.duplicateRowBtn).on('click', () => this.iHandle_duplicateRowBtn());
        $(this.enableEditRowBtn).on('click', () => this.enableEditMode());
        $(this.updateEditedRowBtn).on('click', () => this.handleUpdateEditedRow());
        $(this.discardEditedRowBtn).on('click', () => this.discardEditRowChanges());
        $(this.deleteRowBtn).on('click', () => this.iHandle_deleteRow());

        // initialize the Tabulator Instance
        // fixing iTr_columnsObj getting old column configs
        const table_opts = this.getInitOptions();
        this.iTr_columnsObj = () => table_opts.columns;
        this.TabulatorObj = new Tabulator(TableId, table_opts);
        this.TabulatorObj.CustomTabulator = this;

        // getting the status if the column is present or not and storing them inside the variables.
        this.isRowSelectionColPresent = this.getTableColumns().some(function (col) {
            return col.field === 'rowSelection';
        });
        this.isRowExpandColPresent = this.getTableColumns().some(function (col) {
            return col.field === 'rowExpand';
        });

        this.init();
    }
    //#endregion
    // </editor-fold>

    deepMatchHeaderFilterfunction(headerValue, rowValue, rowData, filterParams) {
        // We check if we've already walked through that node (and therefore subtree).
        /* let cachedStatus = deepMatchHeaderFilterStatusMap[rowData.id]; */
        /*  if (cachedStatus != null) {
          //  If so, we return the cached result.
          return cachedStatus;
        } */

        let columnName = filterParams.field;

        let anyChildMatch = false;

        let children = rowData._children ? (Array.isArray(rowData._children) ? rowData._children : [rowData._children]) : [];
        for (let childRow of children) {
            // We walk down the tree recursively
            let match = this.deepMatchHeaderFilterfunction(headerValue, childRow[columnName], childRow, filterParams);
            /* deepMatchHeaderFilterStatusMap[rowData.id] = match; */
            if (match) {
                anyChildMatch = true;
            }
        }

        // If any child (and therefore any descendant) matched, we return true.
        if (anyChildMatch) {
            return true;
        }

        // We run the actual maching test where applicable. This could be a customised function (passed in the filterParams, for example).
        if (filterParams.type === 'equal') {
            if (rowValue != null && String(rowValue).toLowerCase() == String(headerValue).toLowerCase()) {
                return true;
            }
        } else if (rowValue != null && rowValue.toString().toLowerCase().includes(headerValue.toLowerCase())) {
            return true;
        }

        return false;
    }

    iTr_expTbl_fn_expandToEl = (level, expand_row, tableId, expand_row_TblHeight = null) => {
        // expand_row_TblHeight - optional, used  as from Leve2, it will set the correct exp row height to accommodate the new table.
        const tableContainer = `${tableId}-container`;
        const scr_col = ['primary', 'info'];
        if (expand_row_TblHeight && typeof expand_row_TblHeight === 'number') {
            $(this.TabulatorObj.element).attr('style', `height:${expand_row_TblHeight}px !important`);
        }

        $(expand_row.getElement()).addClass(`row-expanded-lvl-${level} overflow-scroll_y mb-2`);
        const tableHolder = $(expand_row.getElement()).closest('.tabulator-tableholder');

        // Calculate scrollbar width dynamically
        const scrollbarWidth = getScrollbarWidth();
        const tableWidth = tableHolder.width() - (tableHolder[0].scrollHeight > tableHolder[0].clientHeight ? scrollbarWidth : 0);
        $(expand_row.getElement()).append(`
           <div class="${tableContainer} table-container p-2 itr-tbl-nested-${level} iCustScroll-${scr_col[level - 2]}" 
               style="width: ${tableWidth}px;">
                   <div class="table-header-toolbar_w px-2"></div>
                   <div id="${tableId}" class="nested-table"></div>
               </div>`);

        // Ensure width updates properly when resizing
        $(window)
            .off('resize.nestedTableResize')
            .on('resize.nestedTableResize', () => {
                const newWidth = tableHolder.width() - getScrollbarWidth();
                $('.table-container', expand_row.getElement()).attr('style', `width: ${newWidth}px`);
            });

        function waitForTabulator(tabulatorId, callback) {
            let checkExist = setInterval(() => {
                let tableInstance = Tabulator.findTable(`#${tabulatorId}`);
                if (tableInstance.length && tableInstance[0]?.CustomTabulator?.iTr_tableBuilded) {
                    clearInterval(checkExist);
                    callback(tableInstance[0]); // Pass the table instance to callback
                }
            }, 100); // Check every 100ms
        }

        waitForTabulator(tableId, (table) => {
            expand_row.getTable().on('iTr_tableResize', () => {
                const updatedWidth =
                    tableHolder.width() - (tableHolder[0].scrollHeight > tableHolder[0].clientHeight ? scrollbarWidth : 0) - 3;
                $('.table-container', expand_row.getElement()).attr('style', `width: ${updatedWidth}px`);
            });
            this.iTr_expTbl_resize_allExpTbls();
        });
    };

    iTr_expTbl_resize_allExpTbls = () => {
        $('.tabulator').each(function () {
            const otherTable = Tabulator.findTable($(this)[0]);
            if (otherTable) {
                otherTable[0].dispatchEvent('iTr_tableResize');
            }
        });
    };

    // <editor-fold defaultstate="collapsed" desc=" fn: getInitOptions ">
    //#region - fn, getInitOptions
    getInitOptions = () => {
        /**
         * @type {import("../types/tabulator.js").Tabulator.Options}
         */
        const printObj = this.exportsFns.export_def().print || {};
        const tableOptions = {
            // <editor-fold defaultstate="collapsed" desc=" COMMENT: list of different options we may use ">
            //#region -COMMENT: list of different options we may use
            // infinite-loading
            /* 
                paginationSize: 30,
                progressiveLoad: 'scroll',
                progressiveLoadScrollMargin: 200, 
            */

            // paginated
            /*
                paginationMode: 'local',    // [remote | local] see also // see also in remote/local section
                pagination: true,
                paginationSize: 100,
                paginationInitialPage: 1,
                paginationCounter: 'rows',
                paginationSizeSelector: [25, 50, 100, 500, 1000, 2500, 5000, 10000, 25000],            
            */

            // remote/local
            /*
                paginationMode: 'remote',   // see also in paginated section
                sortMode: 'remote',
                filterMode: 'remote',
            */
            //#endregion
            // </editor-fold>

            // layouts
            footerElement: `<div class='table-status d-flex justify-content-between w-100 align-items-center'><i class="fal fa-spinner fa-spin"></i></div>`,
            paginationSize: 25,
            validationMode: 'highlight',
            dataLoader: true,
            dataLoaderLoading: _iGUAJAX_loader.laoderEl_for_iTr,
            dataLoaderError,
            virtualDom: true,
            height: '900px',
            // columnHeaderSortMulti: true,
            sortOrderReverse: true,
            sortMode: 'remote',
            filterMode: 'remote',
            headerFilterLiveFilterDelay: 500,
            layout: 'fitData', // 'fitColumns',
            debugInvalidOptions: false, // To turn off the warning if Tabulator detects using of an option that is not being watched by a module like iExcludeFromList.
            columns: this.AdditionalTabulatorInitOptions.columnsObj.call(this),

            // <editor-fold defaultstate="collapsed" desc=" AJAX's code ">
            //#region -AJAX's code
            ajaxConfig: {
                method: 'POST',
                headers: {
                    csrftoken: _userStr, // Add the CSRFToken to the headers
                },
            },
            ajaxParams: function () {
                return { key1: 'value1', key2: 'value2' };
            },
            ajaxURLGenerator: (url, _config, params) => {
                iConsole({ params, url }, this.additionalAjaxParams);
                const sortBy = params?.sort?.map((sortParam) => `${sortParam?.field}:${sortParam?.dir}`).join(',');
                const formattedParams = {
                    page: this.AdditionalTabulatorInitOptions.paginationInitialPage ?? params?.page,
                    per_page: this.AdditionalTabulatorInitOptions.paginationSize ?? params?.size ?? params?.per_page ?? DEFAULT_PAGE_SIZE,
                    ...(sortBy && { sort_by: sortBy }),
                    ...params,
                };

                // global search handler
                if (this.additionalAjaxParams['master_search']) {
                    url = this.additionalAjaxParams['url'];
                    this.additionalAjaxParams['search'] && (formattedParams['search'] = this.additionalAjaxParams['search']);
                    this.additionalAjaxParams['columns'] && (formattedParams['columns'] = this.additionalAjaxParams['columns']);
                }
                params?.filter?.forEach((sortParam) => {
                    if (sortParam?.field) {
                        formattedParams[sortParam.field] = sortParam?.value;
                    }
                });
                // formattedParams += params;
                const searchParams = new URLSearchParams(formattedParams);
                return url + `?${searchParams?.toString()}`;
            },
            ajaxResponse: (url, params, response) => {
                if (this.initMode == 'paginated-remote' || this.initMode == 'infinite-loading') {
                    response['data'] = response['dtRows'];
                    return response;
                }

                let dbRows = [];

                if (!shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_ajaxResponse, url, params, response)) {
                    return;
                }
                dbRows = response['dbRows'] || [];
                return dbRows;
            },
            //#endregion
            // </editor-fold>
            rowFormatter: function (row) {
                // console.log("format")

                // if multi row selection is enabled the run below code to select the rows
                if (_this.isRowSelectionColPresent) {
                    const isMasterSelected = $('input', _this.TabulatorObj.getColumn('rowSelection').getElement()).prop('checked');
                    // select row if master-selected or is_row_selected is true in row.getData()
                    if (isMasterSelected || row.getData().is_row_selected) {
                        _this.selectRowAndCheckInput(row);
                    }
                }

                if (!shouldRunAndProceed(this.iTr_row_formatter_before, row)) {
                    return;
                }

                if (row.getData().isCurrentRow?.edit_mode) {
                    if (this.isRowSelectionColPresent) {
                        $('input[type="checkbox"]', row.getCell('rowSelection').getElement()).prop('disabled', true);
                        // added this when there is custom checkbox for rowSelection
                        $('input[type="checkbox"]', row.getCell('rowSelection').getElement()).prop('checked', true);
                    }
                }
                if (row.getData().isCurrentRow?.new_row && row.getCell('id')) {
                    $(row.getCell('id').getElement()).addClass('visible-hidden');
                }

                if (this.isRowExpandColPresent && (row.getData().isCurrentRow?.edit_mode || row.getData().isCurrentRow?.new_row)) {
                    $('.expand-btn', row.getCell('rowExpand').getElement()).addClass('disabled').removeClass('btn-success'); //.prop('disabled', true);
                }

                this.iTr_row_formatter_after?.(row);
            },

            ...this.AdditionalTabulatorInitOptions,
            ...printObj,
        };

        const hasForbiddenFieldValues = tableOptions.columns.some(
            (col) => col.field !== undefined && this._tbl_columns_field_names_reserved.includes(col.field)
        );
        if (hasForbiddenFieldValues) {
            let message =
                '(iTr msg. 101) You are using a reserved columns field value from this list.\nYou cannot use it.\n\n- ' +
                this._tbl_columns_field_names_reserved.join('\n- ');
            alert(message);
        }

        // <editor-fold defaultstate="collapsed" desc=" settings for most used columns like: [Expand | Select a row | ID | dummy] ">
        //#region - fn, getInitOptions
        let _this = this;
        // /--------- New way
        tableOptions.columns = tableOptions.columns.map((column) => {
            let col_rowExpand = {};
            switch (column.field) {
                case 'rowExpand':
                    col_rowExpand = {
                        title: '',
                        field: 'rowExpand',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        resizable: false,
                        width: 40,
                        print: false,
                        download: false,
                        iExcludeFromList: { src: 1, cv: 1 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                        // expandToKeyData : "gender", // <- use this to send conditions to the nested table settings

                        formatter: function (cell, formatterParams, onRendered) {
                            let el = '';
                            let create_el = true;
                            if (formatterParams.add_rowExpBtn_by_serverDataName || '' !== '') {
                                if (cell.getData()[formatterParams.add_rowExpBtn_by_serverDataName] !== 1) {
                                    create_el = false;
                                }
                            }
                            if (create_el) {
                                el = _this.cellF_rowExpand(cell, formatterParams, onRendered, cell.getColumn().getDefinition()['expandTo']);
                            }

                            if (formatterParams.iTr_rowExpan_afterCreate) {
                                el = formatterParams.iTr_rowExpan_afterCreate(el, cell, formatterParams);
                            }

                            return el;
                        },
                        increaseTblHeight: function (row) {
                            let cell = row.getCell('rowExpand');
                            $(_this.TabulatorObj.element).attr('style', cell.getColumn().getDefinition()['expandTblHeight_style']);
                        },
                        scrollRowTblAfterLoad: function (row) {
                            // row.getElement().scrollIntoView({block:"end"});
                            _this.TabulatorObj.scrollToRow(row, 'top', false);

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                        },
                        ...column,
                    };
                    break;
                case 'rowSelection':
                    col_rowExpand = {
                        //  have the row select based on D.B. info, the retuned JSON need to have
                        //          is_row_selected => true
                        title: 'Select',
                        field: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        //                        vertAlign: 'middle',
                        // headerSort: false,
                        resizable: false,
                        width: 60,
                        iExcludeFromList: { src: 1, cv: 1 },
                        print: false,
                        download: false,
                        sorter: (_, __, a, b) => {
                            return this.iTr_rowSelection_customSort(
                                _,
                                __,
                                a,
                                b,
                                this.AdditionalTabulatorInitOptions.iTr_rowSelectionCell_CustomSortOrder
                            );
                        },
                        titleFormatter: this.iTr_row_selection_header_tbl_cell_formatter,
                        formatter: this.iTr_row_selection_tbl_cell_formatter,
                        //            titleFormatterParams: {
                        //                rowRange: 'active', //only toggle the values of the active filtered rows
                        //            },
                        ...column,
                    };
                    break;
                case 'id':
                    col_rowExpand = {
                        title: 'ID',
                        field: 'id',
                        visible: isColumnVisible.call(this, 'id'),
                        //frozen:true,
                        width: 70,
                        headerFilter: 'input',
                        sorter: 'number',
                        // cssClass: "ps-2",
                        iExcludeFromList: { cv: 1 }, // to appear on: scr: search dropdown, cv: column visibility dropdown   // to appear on: scr: search dropdown, cv: column visibility dropdown
                        ...column,
                    };
                    break;
                case '__dummy__':
                    col_rowExpand = {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 150,
                        print: false,
                        download: false,
                        headerSort: false,
                        iExcludeFromList: { src: 1, cv: 1 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                        ...column,
                    };
                    break;
                case '__dummy_front__':
                    col_rowExpand = {
                        title: '',
                        field: '__dummy_front__',
                        visible: isColumnVisible.call(this, '__dummy_front__'),
                        resizable: false,
                        width: 30,
                        minWidth: 1,
                        print: false,
                        download: false,
                        headerSort: false,
                        iExcludeFromList: { src: 1, cv: 1 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                        ...column,
                    };
                    break;
                default:
                    col_rowExpand = { ...column };
                    break;
            }
            if (col_rowExpand?.iTr_headerFilter_by_ddFilter) {
                // To add header filter: add this in the colums def.:
                //      iTr_headerFilter_by_ddFilter: { type: 'multi-checkbox'},
                // add iTr_dropdown_ops: {} in case you want to change from the deffault.
                //      iTr_headerFilter_by_ddFilter: { type: 'multi-checkbox', iTr_dropdown_ops: {}},
                //          For a list of attributes that we can use, search for: function createTableDropdown
                // at the end we are able to use any attribute from: iTr_headerFilter_by_ddFilter
                //
                // In case we want to show in the DD other text than the cell's value, add this attribute to iTr_dropdown_ops
                // setText_byValue:(cell)=>{
                //     let cell_vall = cell.getValue();
                //     let rtn = cell_vall === "Device MUTED" ? "--Device MUTED" : cell_vall === "Down" ? "--Down" : cell_vall === "Live" ? "--Live" : cell_vall === "Never Connected" ? "--Never Connected" : cell_vall;
                //    return rtn;
                // }

                if (!col_rowExpand.width) {
                    col_rowExpand.width = 260;
                }
                if (!col_rowExpand.minWidth) {
                    col_rowExpand.minWidth = 175;
                }
                col_rowExpand.headerId = `header_select_${col_rowExpand.field}_${performance.now().toString().replace('.', '_')}`;
                col_rowExpand.headerDropdownId = `header_dropdown_${col_rowExpand.field}_${performance.now().toString().replace('.', '_')}`;

                col_rowExpand.headerFilter = (cell, onRendered, success, cancel) => {
                    const div = $(`<div id='${col_rowExpand.headerId}'></div>`);
                    return div[0];
                };
            }
            if (!col_rowExpand.headerFilterFunc && this.AdditionalTabulatorInitOptions.dataTree) {
                col_rowExpand.headerFilterFunc = (headerValue, rowValue, rowData, filterParams) => {
                    filterParams.field = column.field;
                    return this.deepMatchHeaderFilterfunction(headerValue, rowValue, rowData, filterParams);
                };
            }
            return col_rowExpand;
        });
        // -----------/

        //        // <editor-fold defaultstate="collapsed" desc=" rowExpand ">
        //        //#region - fn, rowExpand
        //        let _this = this;
        //        var col_rowExpand_idx = tableOptions.columns.findIndex(function(item) {
        //            return item.field === "rowExpand";
        //        });
        //        if (tableOptions.columns[col_rowExpand_idx]) {
        //            let col_rowExpand = {
        //                title: '',
        //                field: 'rowExpand',
        //                headerHozAlign: 'center',
        //                hozAlign: 'center',
        //                vertAlign: 'middle',
        //                headerSort: false,
        //                width: 30,
        //                print: false,
        //                download: false,
        //                iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
        //
        //                // expandToKeyData : "gender", // <- use this to send conditions to the nested table settings
        //
        //                formatter: function (cell, formatterParams, onRendered) {
        //                    let el = "";
        //                    let create_el = true;
        //                    if(formatterParams.add_rowExpBtn_by_serverDataName || "" !== ""){
        //                        if(cell.getData()[formatterParams.add_rowExpBtn_by_serverDataName] !== 1){
        //                            create_el = false;
        //                        }
        //                    }
        //                    if(create_el){
        //                        el = _this.cellF_rowExpand(cell, formatterParams, onRendered, cell.getColumn().getDefinition()["expandTo"]);
        //                    }
        //                    return el;
        //                },
        //                increaseTblHeight: function(row){
        //                    let cell = row.getCell("rowExpand");
        //                    $(_this.TabulatorObj.element).attr('style', cell.getColumn().getDefinition()["expandTblHeight_style"]);
        //                },
        //                scrollRowTblAfterLoad: function(row){
        //                    // row.getElement().scrollIntoView({block:"end"});
        //                    _this.TabulatorObj.scrollToRow(row, "top", false);
        //
        //                    // this is not working
        //                    // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
        //                }
        //            };
        //
        //            tableOptions.columns[col_rowExpand_idx] = $.extend(true, col_rowExpand, tableOptions.columns[col_rowExpand_idx]);
        //        }
        //        //#endregion
        //        // </editor-fold>
        //
        //        // <editor-fold defaultstate="collapsed" desc=" rowSelection ">
        //        //#region -rowSelection
        //        var col_rowSelection_idx = tableOptions.columns.findIndex(function(item) {
        //            return item.field === "rowSelection";
        //        });
        //        if (tableOptions.columns[col_rowSelection_idx]) {
        //            let col_rowSelection = {
        //                //  have teh row select based on D.B. info, the retuned JSON need to have
        //                //          is_row_selected => true
        //                title: 'Select',
        //                field: 'rowSelection',
        //                headerHozAlign: 'center',
        //                hozAlign: 'center',
        //                vertAlign: 'middle',
        //                headerSort: false,
        //                width: 60,
        //                iExcludeFromList: {src:0, cv:0},
        //                print: false,
        //                download: false,
        //                titleFormatter: this.iTr_row_selection_header_tbl_cell_formatter,
        //                formatter: this.iTr_row_selection_tbl_cell_formatter,
        //    //            titleFormatterParams: {
        //    //                rowRange: 'active', //only toggle the values of the active filtered rows
        //    //            },
        //            };
        //
        //            tableOptions.columns[col_rowSelection_idx] = $.extend(true, col_rowSelection, tableOptions.columns[col_rowSelection_idx]);
        //        }
        //        //#endregion
        //        // </editor-fold>
        //
        //        // <editor-fold defaultstate="collapsed" desc=" id ">
        //        //#region -id
        //        var col_id_idx = tableOptions.columns.findIndex(function(item) {
        //            return item.field === "id";
        //        });
        //        if (tableOptions.columns[col_id_idx]) {
        //            let col_id = {
        //                title: 'ID',
        //                field: 'id',
        //                visible: isColumnVisible.call(this, 'id'),
        //                //frozen:true,
        //                width: 70,
        //                headerFilter: 'input',
        //                //headerCssClass: "ps-0",   // <- not exist such attribute
        //                sorter: 'number',
        //                // cssClass: "ps-2",
        //                iExcludeFromList: {cv:0},   // to appear on: scr: search dropdown, cv: column visibility dropdown
        //            };
        //
        //            tableOptions.columns[col_id_idx] = $.extend(true, col_id, tableOptions.columns[col_id_idx]);
        //        }
        //        //#endregion
        //        // </editor-fold>
        //
        //        // <editor-fold defaultstate="collapsed" desc=" dummy ">
        //        //#region -__dummy__
        //        var col___dummy___idx = tableOptions.columns.findIndex(function(item) {
        //            return item.field === "__dummy__";
        //        });
        //        if (tableOptions.columns[col___dummy___idx]) {
        //            let col___dummy__ = {
        //                title: '',
        //                field: '__dummy__',
        //                visible: isColumnVisible.call(this, '__dummy__'),
        //                width: 50,
        //                print: false,
        //                download: false,
        //                headerSort: false,
        //                iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
        //            };
        //
        //            tableOptions.columns[col___dummy___idx] = $.extend(true, col___dummy__, tableOptions.columns[col___dummy___idx]);
        //        }
        //        //#endregion
        //        // </editor-fold>
        //#endregion
        // </editor-fold>

        return tableOptions;
    };

    toggleAllTreeRows(dataTreeToggle) {
        // true: Expan | false: collapse
        // const dataTreeToggle = !this.TabulatorObj.options.dataTreeStartExpanded
        this.TabulatorObj.options.dataTreeStartExpanded = dataTreeToggle;

        // Refresh the table to apply the changes
        this.TabulatorObj.setData(this.TabulatorObj.getData());

        const cc = dataTreeToggle ? 'fa-minus-square' : 'fa-plus-square';
        $('#expCol_master').removeClass('fa-plus-square fa-minus-square').addClass(cc);

        // update button
    }

    resetFilter = () => {
        // Clear table filters
        this.isResettingFilters = true;
        $('.tbl_master_search-input', this.tableContainer).val('');
        if (this.TabulatorObj.getFilters().length) {
            this.TabulatorObj.clearFilter();
        }
        if (this.TabulatorObj.getHeaderFilters().length) {
            this.TabulatorObj.clearHeaderFilter();
            this.TabulatorObj.dispatchEvent('iTr_tableHeaderBuild');
        }
        this.isResettingFilters = false;
    };

    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" fn: iTr_rowSelection_customSort ">
    iTr_rowSelection_customSort(_, __, a, b, iTrCustomSortOrder) {
        // +info+
        const sortOrder = iTrCustomSortOrder ?? [
            { is_row_selected: true, is_disabled: false }, // Selected
            { is_row_selected: false, is_disabled: false }, // Not selected
            { is_row_selected: undefined, is_disabled: false }, // Not selected actually was never selected
            { is_row_selected: true, is_disabled: true }, // Disabled selected
            { is_row_selected: false, is_disabled: true }, // Disabled not selected
            { is_row_selected: undefined, is_disabled: true }, // Disabled empty
            { is_row_selected: undefined, is_disabled: undefined }, // Empty
        ];

        // Normalize values
        const normalizeValue = (value) => {
            if (value === 1) return true;
            if (value === 0) return false;
            return value; // Return as-is for undefined or already boolean
        };

        const aData = {
            is_row_selected: normalizeValue(a.getData().is_row_selected),
            is_disabled: normalizeValue(a.getData().is_disabled),
        };

        const bData = {
            is_row_selected: normalizeValue(b.getData().is_row_selected),
            is_disabled: normalizeValue(b.getData().is_disabled),
        };

        const aIndex = sortOrder.findIndex(
            (order) => order.is_row_selected === aData.is_row_selected && order.is_disabled === aData.is_disabled
        );

        const bIndex = sortOrder.findIndex(
            (order) => order.is_row_selected === bData.is_row_selected && order.is_disabled === bData.is_disabled
        );

        return aIndex - bIndex;
    }
    // </editor-fold>

    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" fn: init ">
    //#region fn: init
    // -----------------------------------------------------------------
    init() {
        // console.clear();
        iConsole(this);
        this.initTabulatorEvents();
        // <editor-fold defaultstate="collapsed" desc=" Function to search table, for remote tables ">
        //#region -Function to search table, for remote tables
        const iTr_searchTbl_remote = (search) => {
            // get selected filter columns
            // if none then use "*" (wildcard) (search all)

            let inputs =
                this.tbl_MasterSearch_colsdDdown.getTableInstance()?.getSelectedData() ||
                this.getTableColumns().filter((listItem) => listItem.iExcludeFromList?.['src'] !== 1); // convert the jQuery object into a plain array

            const columnsToSearch = inputs.map((input) => {
                return input.field;
            });

            const endPoint = new URL(this.AdditionalTabulatorInitOptions.masterFilterURL);
            this.additionalAjaxParams['master_search'] = true;
            this.additionalAjaxParams['search'] = search ? `*${search}*` : '';
            this.additionalAjaxParams['url'] = endPoint;
            this.additionalAjaxParams['columns'] = columnsToSearch.toString();

            // trigger tabulator ajax manually
            this.TabulatorObj.setData();
        };
        //#endregion
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc=" Function to search table, for local tables ">
        //#region -Function to search table, for local tables
        const _iTr_searchTbl_local = (search) => {
            // let selectedColumns = $('.dropdown-menu .dds_itemsList_w input:checked', tbl_MasterSearch_colsdDdown).toArray();
            const selectedColumns = this.tbl_MasterSearch_colsdDdown_options.filter((item) => item.visible && item.selected);
            let filters = selectedColumns.map((col) => ({
                field: col.field,
                type: 'like',
                value: search,
            }));
            const currentFilters = this.TabulatorObj.getFilters().filter((filter) => !Array.isArray(filter));
            currentFilters.push(filters);
            // update the filter to trigger Tabulator search
            if (filters.length > 0 && !this.AdditionalTabulatorInitOptions.dataTree) {
                this.TabulatorObj.setFilter(currentFilters);
            }

            // needed to update the status bar on table when doing local searching
            // this event is needed to get exact number of rows after filters
            this.updateStatus();
        };
        const iTr_searchTbl_local = (search) => {
            const selectedColumns = this.tbl_MasterSearch_colsdDdown_options.filter((item) => item.visible && item.selected);

            // Create a custom filter function for tree data
            const treeSearchFilter = (data) => {
                // If search is empty, show all rows
                if (!search) return true;

                // Check if any selected column contains the search text
                const matchesSearch = selectedColumns.some((col) => {
                    const cellValue = data[col.field];
                    if (!cellValue) return false;
                    return String(cellValue).toLowerCase().includes(search.toLowerCase());
                });

                // If this row matches, or has children that match, show it
                if (matchesSearch) return true;

                // If this row has children, check them recursively
                let children = data._children ? (Array.isArray(data._children) ? data._children : [data._children]) : [];

                return children.some((child) => treeSearchFilter(child));
            };

            const currentFilters = this.TabulatorObj.getFilters().filter(
                (filter) => !Array.isArray(filter) && typeof filter !== 'function'
            );

            if (this.AdditionalTabulatorInitOptions.dataTree) {
                // For tree data, use the custom filter function
                this.TabulatorObj.setFilter(treeSearchFilter);
            } else {
                // Original logic for non-tree data
                let filters = selectedColumns.map((col) => ({
                    field: col.field,
                    type: 'like',
                    value: search,
                }));
                currentFilters.push(filters);
                if (filters.length > 0) {
                    this.TabulatorObj.setFilter(currentFilters);
                }
            }

            // Update the status bar
            this.updateStatus();
        };
        //#endregion
        // </editor-fold>

        const handleSearchDebounced = {
            fn: debounce((e) => {
                iTr_searchTbl_remote(e.target.value);
            }, parseInt(this.TableSettings.filter_by.on_type.input_value)),
        };

        // <editor-fold defaultstate="collapsed" desc=" tbl_Setting_menu ">
        //#region -tbl_Setting_menu
        // settings dropdown
        const tbl_Setting_menu = $('#TMPL_tbl_Setting_menu').clone(true).removeClass('d-none').removeAttr('id');
        tbl_Setting_menu.find('ul.dropdown-menu').on('click', (e) => e.stopPropagation());

        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        //#region -COMMENT
        /* 
        const radioInputs = tbl_Setting_menu.find("ul.dropdown-menu input[type='radio']").toArray();
        const delayInput = tbl_Setting_menu.find('ul.dropdown-menu input.delay-input')
            .val(this.TableSettings.filter_by['on_type'].input_value)
            .on('keydown', (e) => {
                e.preventDefault();
            });
        if (this.TableSettings.filter_by[`on_type`].enabled) {
            $(delayInput).attr('data-item-hidden', 'false');
        }

        radioInputs.forEach((input) => {
            let key = $(input).data('key');

            // adding attributes
            $(input).prop('name', `${this.localStorageKey}-filter_by`).prop('checked', this.TableSettings.filter_by[key].enabled);

            $(input).on('change', () => {
                Object.keys(this.TableSettings.filter_by).forEach((key) => {
                    this.TableSettings.filter_by[key].enabled = false;
                });
                this.TableSettings.filter_by[key].enabled = $(input).prop('checked');

                // hide-show delayInput
                if (key == 'on_type') {
                    $(delayInput).attr('data-item-hidden', false);
                } else {
                    $(delayInput).attr('data-item-hidden', true);
                }
                Store.set(this.localStorageKey, this.TableSettings);

                // update function
                handleSearchDebounced.fn = _.debounce((e) => {
                    iTr_searchTbl_remote(e.target.value);
                }, Number(this.TableSettings.filter_by.on_type.input_value));
            });
        });
        */
        //#endregion
        // </editor-fold>

        const on_type_switch_el = tbl_Setting_menu.find("ul.dropdown-menu .filter-by-container input[data-key='on_type-switch']");
        const delayInput = tbl_Setting_menu
            .find('ul.dropdown-menu .filter-by-container input.delay-input')
            .val(this.TableSettings.filter_by['on_type'].input_value)
            .on('keydown', (e) => {
                e.preventDefault();
            })
            .on('change', () => {
                this.TableSettings.filter_by['on_type'].input_value = $(delayInput).prop('value');
                Store.set(this.localStorageKey, this.TableSettings);
            });
        if (this.TableSettings.filter_by[`on_type`].enabled) {
            $(delayInput).attr('data-item-hidden', 'false');
        }

        $(on_type_switch_el)
            .prop('name', `${this.localStorageKey}-filter_by`)
            .prop('checked', this.TableSettings.filter_by['on_type'].enabled);
        $(on_type_switch_el).on('change', () => {
            Object.keys(this.TableSettings.filter_by).forEach((key) => {
                this.TableSettings.filter_by[key].enabled = false;
            });
            this.TableSettings.filter_by['on_type'].enabled = $(on_type_switch_el).prop('checked');
            // hide-show delayInput
            $(delayInput).attr('data-item-hidden', !$(on_type_switch_el).prop('checked'));
            Store.set(this.localStorageKey, this.TableSettings);

            // update function
            handleSearchDebounced.fn = debounce((e) => {
                iTr_searchTbl_remote(e.target.value);
            }, Number(this.TableSettings.filter_by.on_type.input_value));
        });

        tbl_Setting_menu
            .find(".persist-column-settings-container input[type='checkbox']")
            .prop('checked', this.TableSettings.persist_column_visibility.enabled)
            .change((e) => {
                iConsole('FFFF');
                this.TableSettings.persist_column_visibility.enabled = e.target.checked;
                if (!e.target.checked) {
                    this.TableSettings.persist_column_visibility.hiddenColumns = [];
                }
                Store.set(this.localStorageKey, this.TableSettings);
            });

        // reset settings on clear button
        tbl_Setting_menu.find('button.clear-settings-btn').click(() => {
            tbl_Setting_menu.find(".persist-column-settings-container input[type='checkbox']").prop('checked', false).trigger('change');
            radioInputs.forEach((input, idx) => {
                $(input).prop('checked', idx >= 1 ? false : true);
                let key = $(input).data('key');
                this.TableSettings.filter_by[key].enabled = $(input).prop('checked');
                Store.set(this.localStorageKey, this.TableSettings);
                handleSearchDebounced.fn = debounce((e) => {
                    iTr_searchTbl_remote(e.target.value);
                }, Number(this.TableSettings.filter_by.on_type.input_value));
            });
        });
        //#endregion
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc=" tbl_ExportTo_menu ">
        //#region -tbl_ExportTo_menu
        const tbl_ExportTo_menu = $('#TMPL_tbl_ExportTo_menu').clone(true).removeClass('d-none').removeAttr('id');

        // mouseover event for closing the opened dropdown and popovers, when hovered on it
        $(tbl_ExportTo_menu).mouseover(() => {
            iBS_hideAll_Dropdowns();
            iBS_hideAll_Popovers();
        });
        if (this.exports.types) {
            this.exports.types.forEach((type) => {
                const btn = $(`<button class="btn">${type}</button>`).click(this.exportsObj[type.toLowerCase()]);
                tbl_ExportTo_menu.find('.download-btns').append(btn);
            });
        }
        //#endregion
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc=" adding elements to: table header toolbar ">
        //#region -tbl_ExportTo_menu
        /*
         * [single_select|multi_select|multi_purps]": {els: [".elClass1", ".elClass2"..], "cc": ["class to add to_.elClass1", "class to add to_.elClass2"]}
         */
        let tblContainer = this.tableContainerElement;
        let appendTo_el = $('.table-header-toolbar_w', tblContainer);
        $('.table-header-toolbar_w', tblContainer).empty();

        if (!Object.entries(this.tbl_toolbars[0]).length) {
            $('.table-header-toolbar_w', tblContainer).addClass('d-none');
        }

        $('#TMPL_tbl_toolbars_f01').clone(true).removeAttr('id').removeClass('d-none').appendTo(appendTo_el);
        let axns = this.tbl_toolbars[1];

        Object.entries(this.tbl_toolbars[0]).forEach(([key, attributes]) => {
            const [element, el_cls] = [key, attributes['c'] || this.tbl_toolbars_def[key]['c']];

            switch (element) {
                case 'tbl_upload_rows': {
                    this.uploadCopiedRowsBtn = $('#TMPL_upload_row_btn').clone(true).removeAttr('id').removeClass('d-none');
                    $('.tbl_rowSel_w', tblContainer).append(this.uploadCopiedRowsBtn).toggleClass(el_cls);
                    this.uploadCopiedRowsBtn.on('click', () => {
                        // add some default behaviours
                        this.AdditionalTabulatorInitOptions.iTr_on_upload_row_btn_click?.();
                    });
                    break;
                }
                case 'read_mode': {
                    $('.tbl_read_mode_w', tblContainer).append($(this.addNewRowBtn).toggleClass(el_cls));

                    let elms = $('.tbl_read_mode_w', tblContainer);
                    axns?.read_remove?.forEach((item) => {
                        $(item, elms).remove();
                    });

                    axns?.read_mode?.els.forEach((classname, idx) => {
                        let cl_text = classname.substring(1); // remove the "." from the classname
                        $.each($(classname, axns.el_w), function (i, el) {
                            let $el = $(el, axns.el_w).clone(true).removeClass(cl_text);
                            $el.addClass(`${axns?.read_mode?.cc?.[idx] || ''}`);
                            $('.tbl_read_mode_w', tblContainer).append($el);
                        });
                    });
                    break;
                }
                case 'editing': {
                    let elms = this.rowOperationsContainer;
                    axns?.edit_remove?.forEach((item) => {
                        $(item, elms).remove();
                    });

                    $('.tbl_single_select_w', tblContainer).append($(elms).toggleClass(el_cls));
                    // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
                    //                    axns?.single_select?.els.forEach((classname, idx) => {
                    //                        let cl_text = classname.substring(1); // remove the "." from the classname
                    //                        $.each($(classname, axns.el_w), function(i, el){
                    //                            let $el = $(el, axns.el_w).clone(true).removeClass(cl_text);
                    //                            $el.addClass(`${$el.attr("disable_on_edit")} ${axns?.single_select?.cc?.[idx] || ""}`);
                    //                            $('.single-row-operations-container', tblContainer).append($el);
                    //                        });
                    //                    });
                    //
                    //                    axns?.multi_select?.els.forEach((classname, idx) => {
                    //                        let cl_text = classname.substring(1); // remove the "." from the classname
                    //                        $.each($(classname, axns.el_w), function(i, el){
                    //                            let $el = $(el, axns.el_w).clone(true).removeClass(cl_text);
                    //                            $el.addClass(`${$el.attr("disable_on_edit")} ${axns?.multi_select?.cc?.[idx] || ""}`);
                    //                            $('.tbl_multi_select_w', tblContainer).append($el);
                    //                        });
                    //                    });
                    //
                    //                    if(axns?.multi_purps === undefined){
                    //                        $(".tbl_multy_purps_w", tblContainer).addClass("d-none");
                    //                        $(".tbl_rowSel_w", tblContainer).removeClass("col-12 col-lg-4").addClass("col");
                    //                    } else {
                    //                        axns?.multi_purps?.els.forEach((classname, idx) => {
                    //                            let cl_text = classname.substring(1); // remove the "." from the classname
                    //                            $.each($(classname, axns.el_w), function(i, el){
                    //                                let $el = $(el, axns.el_w).clone(true).removeClass(cl_text);
                    //                                $el.attr("id", $el.attr("to_id"));
                    //                                $el.addClass(`${$el.attr("disable_on_edit")} ${axns?.multi_purps?.cc?.[idx] || ""}`);
                    //                                $('.tbl_multy_purps_w', tblContainer).addClass("border");   // must be here and not in teh HTML b/c we have border if there are elements
                    //                                $('.tbl_multy_purps_w', tblContainer).append($el);
                    //                            });
                    //                        });
                    //                    }
                    // </editor-fold>
                    break;
                }
                /*case "tbl_multy_purps":{
                    // the central area above the table
                    $(".tbl_multy_purps_w", tblContainer).append($('#TMPL_multi_purpose_btns_template').clone(true).removeAttr("id").removeClass("d-none")).toggleClass(el_cls);
                    break;
                }*/
                // <editor-fold defaultstate="collapsed" desc=" case "search" ">
                case 'search': {
                    // let mFilter_width = this.fTbl_controlers.find(obj => obj.tblSearch)?.tblSearch?.input_w || 350;
                    // let mFilter_width = item[element].input_w || this.tbl_toolbars_def.search.input_w || 350;
                    let mFilter_width = attributes.input_w || this.tbl_toolbars_def.search.input_w || 350;

                    const tbl_MasterSearch_w = iGet_el_MasterFilter({
                        input_el: { style: `width: ${mFilter_width}px; padding-right: 60px;` },
                    });
                    // <editor-fold defaultstate="collapsed" desc=" COMMENT keep it for referance ">
                    /*
                    const __tbl_MasterSearch_colsdDdown = iGet_el_SelectDropdown({
                        calling_for: 'masterSearch',
                        el_w: { class: 'position-absolute z-index-1', style: `transform: translate(${mFilter_width - 59}px, 1px);` },
                        calling_btn: {
                            style: 'border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;',
                            icon: { class: 'fa-line-columns fa-filter' },
                        },
                        dd_title: { text: 'Select columns to search table by' },
                        dd_filter: { input: { placeholder: 'Search column name...' } },
                        dd_select_list: { data: this.getTableColumns(), exludeBy: 'src' },
                        tbl_int_mode: this.initMode,
                        fn_onInptChkChange: (e, ops) => {
                            let $tblM_search_el = $('.tbl_master_search-input', $(e.target).closest('.master_search_w'));
                            if (ops.tbl_int_mode == 'paginated-local') {
                                iTr_searchTbl_local($tblM_search_el.val());
                            } else {
                                iTr_searchTbl_remote($tblM_search_el.val());
                            }
                        },
                    });
                    */
                    // </editor-fold>
                    this.tbl_MasterSearch_colsdDdown_options = this.getTableColumns().map((item) => {
                        if (item.iExcludeFromList?.['src'] === 1) {
                            item.visible = false;
                        }
                        item.selected = true;
                        return item;
                    });

                    const tbl_MasterSearch_colsdDdown = createDropdownForTable(
                        {
                            dd_el_w: { class: 'position-absolute z-index-1', style: 'transform: translate(295px, 1px);' },
                            dd_calling_btn: {
                                text: `<i class="${_DEV_i ?? 'fal'} fa-signal fa-rotate-270"></i>`,
                                // title,
                                width: 200,
                                class: 'btn text-start w-100 rounded-1 rounded-end',
                                style: 'padding-top: 6px; padding-bottom: 6px; top: -1px; background-color:#fff; color:#212529; border:1px solid #ced4da;',
                            }, // the element opened once we
                            iTr_dd_title: 'columns to search',
                            reactiveData: true, // in order that changes will be reflected in the dd tabulator
                            iTr_initTblOnStart: true,
                            dd_select_list: {
                                id: `tbl_MasterSearch_colsdDdown_${performance.now().toString().replace('.', '_')}`,
                                deselectAll: true,
                                defaultSelected: true,
                                class: 'dropdown-menu-end',
                            },
                            //  not clear if and when we use them class_name, style_name
                            fn_beforeDropdownShow: (e, table) => {
                                if (table) {
                                    table.refreshFilter();
                                }
                            },
                            iTr_ddList: { type: 'multi-checkbox' },
                            iTr_table_index: 'field',
                            iTr_field_name: 'title',
                            iTR_filter: [
                                {
                                    field: 'visible',
                                    type: '=',
                                    value: true,
                                },
                            ],
                            fn_onDropdownClick: (crow, selectedRows, table, dropdown) => {
                                table.getRows().map((row) => {
                                    row.update({ selected: row.isSelected() });
                                });
                                let $tblM_search_el = $(
                                    '.tbl_master_search-input',
                                    $(tbl_MasterSearch_colsdDdown.dropdown[0]).closest('.master_search_w')
                                );
                                if (this.initMode == 'paginated-local') {
                                    iTr_searchTbl_local($tblM_search_el.val());
                                } else {
                                    iTr_searchTbl_remote($tblM_search_el.val());
                                }
                                const badge_nr =
                                    this.tbl_MasterSearch_colsdDdown_options.filter((item) => item.visible).length -
                                    table.getSelectedData().filter((item) => item.visible).length;
                                $('.badge', dropdown).remove();
                                if (badge_nr) {
                                    dropdown.append(
                                        `<span class="position-absolute translate-middle badge rounded-pill bg-primary start-100 z-index-1001 ms-n2">${badge_nr}</span>`
                                    );
                                }
                            },
                            dd_moveToBody: this.iTr_expTbl,
                        },
                        this.tbl_MasterSearch_colsdDdown_options
                    );
                    $('.dropdown-toggle', tbl_MasterSearch_colsdDdown.dropdown).removeClass('ddMBtn_F_01');

                    // adding it to this, to access it outside of this case.
                    this.tbl_MasterSearch_colsdDdown = tbl_MasterSearch_colsdDdown;

                    // tbl_MasterSearch_w.append(tbl_MasterSearch_colsdDdown);
                    tbl_MasterSearch_w.append(tbl_MasterSearch_colsdDdown.dropdown);

                    // <editor-fold defaultstate="collapsed" desc=" on table's global search: form submit ">
                    //#region -on table's global search: input change
                    tbl_MasterSearch_w.find('form').on('submit', (e) => {
                        iConsole("on table's global search: form submit ");
                        e.preventDefault();
                        // enable form-search always when enter-key is pressed.
                        // if (!this.TableSettings.filter_by.on_enter.enabled){ return; }

                        const search = $(e.target).find('input').val();
                        if (!search?.trim()) {
                            return;
                        }

                        if (this.initMode == 'paginated-local') {
                            iTr_searchTbl_local(search);
                        } else {
                            iTr_searchTbl_remote(search);
                        }
                    });
                    //#endregion
                    // </editor-fold>
                    // <editor-fold defaultstate="collapsed" desc=" on table's global search: input change ">
                    //#region -on table's global search: input change
                    tbl_MasterSearch_w.find('form input').on('input', (e) => {
                        iConsole("on table's global search: input change ");
                        if ($(e.target).val() == '') {
                            if (this.additionalAjaxParams['master_search']) {
                                this.additionalAjaxParams['master_search'] = false;
                                this.TabulatorObj.setData();
                            }
                            if (this.initMode == 'paginated-local') {
                                const filters = this.TabulatorObj.getFilters().filter(
                                    (item) => !Array.isArray(item) && typeof item !== 'function'
                                );
                                this.TabulatorObj.setFilter(filters);
                            }
                        }
                        if (this.TableSettings.filter_by.on_type.enabled) {
                            if (this.initMode == 'paginated-local') {
                                if (this.AdditionalTabulatorInitOptions.dataTree && !this.TabulatorObj.options.dataTreeStartExpanded) {
                                    const value = $(e.target).prop('value');
                                    this.toggleAllTreeRows(true);
                                    $(e.target).val(value);
                                } else {
                                    iTr_searchTbl_local($(e.target).prop('value'));
                                }
                            } else {
                                handleSearchDebounced.fn(e); // Needed to trigger the search for <on_type> flag with certain amount of delay.
                            }
                        }
                    });
                    //#endregion
                    // </editor-fold>

                    $('.tbl_ctrls_w', tblContainer).append($(tbl_MasterSearch_w).toggleClass(el_cls));

                    let $masterFilter_clear = $(
                        `<button class="masterFilter_clear rounded-1 col-auto bg-white me-2" title="Clear all filters" type="button" disabled>
                            <i class="btn_icon ${_DEV_i ?? 'fal'} fa-filter"></i>                            
                        </button>`
                    ).click((e) => {
                        let container = $(e.currentTarget).closest('.table-container');
                        if (!container.length) {
                            // to know if we ae in a nested table or not
                            container = $(this.tableContainer);
                        }
                        container.find('.tbl_master_search-input').not(container.find('.table-container .tbl_master_search-input')).val('');

                        // do not clear the exception array list.
                        const filters = this.TabulatorObj.getFilters().filter((flr) => {
                            const col = this.TabulatorObj.getColumn(flr?.field);
                            // if ((!col || col.getDefinition().visible === false) && !this.iTr_masterFilterClear_ops.exception.includes(flr?.field)) {
                            if (col && !this.iTr_masterFilterClear_ops.exception.includes(flr?.field)) {
                                return false;
                            }
                            return true;
                        });
                        this.TabulatorObj.setFilter(filters);

                        //this.TabulatorObj.clearFilter();
                        this.TabulatorObj.clearHeaderFilter();
                        if (this.iTr_masterFilterClear_ops.run_after) {
                            this.iTr_masterFilterClear_ops.run_after();
                        }
                        this.TabulatorObj.dispatchEvent('iTr_tableHeaderBuild');
                        // we ignore the nested table(s) as we want to work only on the current table
                        $('.tabulatorDropdownCustomInput', container)
                            .not(container.find('.table-container .tabulatorDropdownCustomInput'))
                            .each(function () {
                                $(this).val('').trigger('change');
                            });
                        $('.reset_button', container)
                            .not(container.find('.table-container .reset_button'))
                            .each(function () {
                                $(this).click();
                            });
                        container
                            .find('.masterFilter_clear')
                            .not(container.find('.table-container .masterFilter_clear'))
                            .prop('disabled', true);
                        tbl_MasterSearch_w.find('form input').focus();
                    });
                    $('.tbl_ctrls_w', tblContainer).append($masterFilter_clear);
                    break;
                }
                // </editor-fold>
                // <editor-fold defaultstate="collapsed" desc=" case "col_vis" ">
                case 'col_vis': {
                    // col visibility
                    // <editor-fold defaultstate="collapsed" desc=" tbl_ColumsToggleVisib_menu ">
                    //#region -tbl_ColumsToggleVisib_menu
                    // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
                    //                    const __OLD___tbl_ColumsToggleVisib_menu = iGet_el_SelectDropdown({
                    //                        calling_for: 'colsVisibility',
                    //                        el_w: { class: 'move_ddown_to_body col-auto me-2 px-0' },
                    //                        dd_title: { text: 'Select which table columns to view' },
                    //                        dd_filter: { input: { placeholder: 'Search column name...' }, show: '.chboxSelect' },
                    //                        dd_select_list: { data: this.getTableColumns(), exludeBy: 'cv' },
                    //                        applayBtns: { show: 0 },
                    //                        fn_onInptChkChange: (e) => {
                    //                            const val = e.target.value;
                    //                            const ele = this.tbl_MasterSearch_colsdDdown.find(`.dds_itemsList_w input[value=${val}]`);
                    //                            iConsole('ColumsToggleVisib, onInptChkChange', e.target, ele);
                    //
                    //                            if (!e.target.checked) {
                    //                                this.TabulatorObj.hideColumn(val);
                    //                                if (this.TableSettings.persist_column_visibility.enabled && !this.DefaultHiddenColumns.includes(val)) {
                    //                                    this.TableSettings.persist_column_visibility.hiddenColumns.push(val);
                    //                                }
                    //
                    //                                //                    ele.closest(".form-check").attr({'data-hidden-from-menu': true});
                    //                                ele.closest('.form-check').attr({ 'data-hidden-from-menu': true, 'data-hidden-by-col_view': true });
                    //                                $(ele).prop('checked', true); // We are doing the true because ".click" is doing its work and making check to uncheck
                    //                                $(ele).click();
                    //                            } else {
                    //                                // show column
                    //                                this.TabulatorObj.showColumn(val);
                    //                                if (this.TableSettings.persist_column_visibility.enabled && !this.DefaultHiddenColumns.includes(val)) {
                    //                                    const idx = this.TableSettings.persist_column_visibility.hiddenColumns.indexOf(val);
                    //                                    if (idx != -1) {
                    //                                        this.TableSettings.persist_column_visibility.hiddenColumns.splice(idx, 1);
                    //                                    }
                    //                                }
                    //
                    //                                ele.closest('.form-check').attr({ 'data-hidden-from-menu': false, 'data-hidden-by-col_view': false });
                    //                                $(ele).prop('checked', false); // We are doing the false because ".click" is doing its work and making uncheck to check
                    //                                $(ele).click();
                    //                            }
                    //                            Store.set(this.localStorageKey, this.TableSettings);
                    //                        },
                    //                    });
                    // </editor-fold>
                    const tbl_ColumsToggleVisib_menu = createDropdownForTable(
                        {
                            dd_el_w: { class: 'col-auto me-2 px-0' },
                            dd_calling_btn: {
                                text: `<i class="btn_icon ${_DEV_i ?? 'fal'} fa-line-columns"></i>`,
                                // title,
                                width: 200,
                                class: 'btn text-start w-100',
                                style: 'border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px; background-color:#fff; color:#212529; border:1px solid #ced4da;',
                                // reseizable: true,
                            }, // the element opened once we
                            iTr_dd_title: 'Columns to view',
                            reactiveData: true, // in order that changes will be reflected in the dd tabulator
                            dd_select_list: {
                                //                                id: `tbl_ColumsToggleVisib_menu_${performance.now().toString().replace('.', '_')}`,
                                id: `tbl_ColumsToggleVisib_menu_${crypto.randomUUID()}`,
                                deselectAll: true,
                                defaultSelected: true,
                            },
                            //  not clear if and when we use them class_name, style_name
                            iTr_ddList: { type: 'multi-checkbox' },
                            iTr_table_index: 'field',
                            iTr_field_name: 'title',
                            iTr_initTblOnStart: true,
                            iTR_filter: [
                                {
                                    field: 'visible',
                                    type: '=',
                                    value: true,
                                },
                            ],
                            fn_onDropdownClick: (crow, selectedRows, table, dropdown) => {
                                table.getRows().forEach((row) => {
                                    if (row.getData().visible) {
                                        const val = row.getData().field;
                                        const ele = this.tbl_MasterSearch_colsdDdown_options.find((item) => item.field === val);
                                        // iConsole("ColumsToggleVisib, onInptChkChange", e.target, ele);

                                        if (!row.isSelected()) {
                                            this.TabulatorObj.hideColumn(val);
                                            this.TabulatorObj.setHeaderFilterValue(val, '');
                                            const filters = this.TabulatorObj.getFilters()
                                                .map((item) => {
                                                    if (Array.isArray(item)) {
                                                        return item.filter((entry) => entry.field !== val);
                                                    }
                                                    return item.field === val ? null : item;
                                                })
                                                .filter((item) => item !== null);
                                            this.TabulatorObj.setFilter(filters);
                                            if (
                                                this.TableSettings.persist_column_visibility.enabled &&
                                                !this.DefaultHiddenColumns.includes(val)
                                            ) {
                                                this.TableSettings.persist_column_visibility.hiddenColumns.push(val);
                                            }

                                            ele.visible = false;

                                            // //                    ele.closest(".form-check").attr({'data-hidden-from-menu': true});
                                            // ele.closest(".form-check").attr({ "data-hidden-from-menu": true, "data-hidden-by-col_view": true });
                                            // $(ele).prop('checked', true); // We are doing the true because ".click" is doing its work and making check to uncheck
                                            // $(ele).click();
                                        } else {
                                            // show column
                                            this.TabulatorObj.showColumn(val);
                                            // To check if the column is header dropdown column and recreate the dropdown on the header column after hiding the column using col_vis dropdown
                                            if (row.getData().iTr_headerFilter_by_ddFilter) {
                                                this.TabulatorObj.dispatchEvent('iTr_tableHeaderRebuild', val);
                                            }
                                            if (
                                                this.TableSettings.persist_column_visibility.enabled &&
                                                !this.DefaultHiddenColumns.includes(val)
                                            ) {
                                                const idx = this.TableSettings.persist_column_visibility.hiddenColumns.indexOf(val);
                                                if (idx != -1) {
                                                    this.TableSettings.persist_column_visibility.hiddenColumns.splice(idx, 1);
                                                }
                                            }
                                            if (ele.iExcludeFromList?.['src'] !== 1) {
                                                ele.visible = true;
                                            }
                                            const searchTable = this.tbl_MasterSearch_colsdDdown.getTableInstance();
                                            if (searchTable) {
                                                searchTable.getRows().forEach((row) => {
                                                    if (row.getData()['field'] === ele.field && ele.iExcludeFromList?.['src'] !== 1) {
                                                        row.select();
                                                    }
                                                });
                                            }
                                            // ele.closest(".form-check").attr({ "data-hidden-from-menu": false, "data-hidden-by-col_view": false });
                                            // $(ele).prop('checked', false); // We are doing the false because ".click" is doing its work and making uncheck to check
                                            // $(ele).click();
                                        }
                                    }
                                });

                                let $tblM_search_el = $(
                                    '.tbl_master_search-input',
                                    $(this.tbl_MasterSearch_colsdDdown.dropdown).closest('.master_search_w')
                                );
                                if (this.initMode == 'paginated-local') {
                                    iTr_searchTbl_local($tblM_search_el.val());
                                } else {
                                    iTr_searchTbl_remote($tblM_search_el.val());
                                }

                                const badge_nr =
                                    table.getData().filter((data) => data.visible).length -
                                    table.getSelectedData().filter((data) => data.visible).length;
                                $('.badge', dropdown).remove();
                                if (badge_nr) {
                                    dropdown.append(
                                        `<span class="position-absolute translate-middle badge rounded-pill bg-primary start-100 z-index-1001 ms-n2">${badge_nr}</span>`
                                    );
                                }
                                // if (
                                //     this.tbl_MasterSearch_colsdDdown.getTableInstance &&
                                //     this.tbl_MasterSearch_colsdDdown.getTableInstance()
                                // ) {
                                const badge_nr1 =
                                    this.tbl_MasterSearch_colsdDdown_options.filter((item) => item.visible).length -
                                    this.tbl_MasterSearch_colsdDdown
                                        .getTableInstance()
                                        .getSelectedData()
                                        .filter((item) => item.visible).length;
                                $('.badge', this.tbl_MasterSearch_colsdDdown.dropdown).remove();
                                if (badge_nr1) {
                                    this.tbl_MasterSearch_colsdDdown.dropdown.append(
                                        `<span class="position-absolute translate-middle badge rounded-pill bg-primary start-100 z-index-1001 ms-n2">${badge_nr1}</span>`
                                    );
                                }
                                // }

                                Store.set(this.localStorageKey, this.TableSettings);
                            },
                            dd_moveToBody: this.iTr_expTbl,
                        },
                        this.getTableColumns().map((listItem) => {
                            if (listItem.iExcludeFromList?.['cv'] === 1 || this.DefaultHiddenColumns.includes(listItem?.field)) {
                                listItem.visible = false;
                            }
                            return listItem;
                        })
                    );

                    $('.dropdown-toggle', tbl_ColumsToggleVisib_menu.dropdown).removeClass('ddMBtn_F_01');

                    this.tbl_ColumsToggleVisib_menu = tbl_ColumsToggleVisib_menu;
                    //#endregion
                    // </editor-fold>
                    $('.tbl_ctrls_w', tblContainer).append($(tbl_ColumsToggleVisib_menu.dropdown).toggleClass(el_cls));
                    break;
                }
                // </editor-fold>
                case 'export': {
                    $('.tbl_ctrls_w', tblContainer).append($(tbl_ExportTo_menu).toggleClass(el_cls));
                    break;
                }
                case 'settings': {
                    $('.tbl_ctrls_w', tblContainer).append($(tbl_Setting_menu).toggleClass(el_cls));
                    break;
                }

                case 'dataTree': {
                    let c_axns = $.extend(true, attributes, axns['dataTree'] || {});

                    const $el = $(`<i id="expCol_master" class="cursor-pointer p-2"></i>`)
                        //                        .toggleClass(el_cls)
                        .toggleClass(c_axns.c)
                        .click(c_axns.click);

                    $('.tbl_read_mode_w', tblContainer).prepend($el);
                    break;
                }

                default: {
                }
            }
        });

        // <editor-fold defaultstate="collapsed" desc=" single_select ">
        axns?.single_select?.els.forEach((classname, idx) => {
            let cl_text = classname.substring(1); // remove the "." from the classname
            $.each($(classname, axns.el_w), function (i, el) {
                let $el = $(el, axns.el_w).clone(true).removeClass(cl_text);
                $el.addClass(`${$el.attr('disable_on_edit')} ${axns?.single_select?.cc?.[idx] || ''}`);
                $('.single-row-operations-container', tblContainer).append($el);
            });
        });
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" multi_select ">
        axns?.multi_select?.els.forEach((classname, idx) => {
            let cl_text = classname.substring(1); // remove the "." from the classname
            $.each($(classname, axns.el_w), function (i, el) {
                let $el = $(el, axns.el_w).clone(true).removeClass(cl_text);
                $el.addClass(`${$el.attr('disable_on_edit')} ${axns?.multi_select?.cc?.[idx] || ''}`);
                $('.tbl_multi_select_w', tblContainer).append($el);
            });
        });
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" multi_purps ">
        if (axns?.multi_purps === undefined) {
            $('.tbl_multy_purps_w', tblContainer).addClass('d-none');
            $('.tbl_rowSel_w', tblContainer).removeClass('col-12 col-lg-4').addClass('col');
        } else {
            axns?.multi_purps?.els.forEach((classname, idx) => {
                let cl_text = classname.substring(1); // remove the "." from the classname
                $.each($(classname, axns.el_w), function (i, el) {
                    let $el = $(el, axns.el_w).clone(true).removeClass(cl_text);
                    if ($el.hasAttr('to_id')) {
                        $el.attr('id', $el.attr('to_id'));
                    }
                    if ($el.hasAttr('to_for')) {
                        $el.attr('for', $el.attr('to_for'));
                    }
                    $el.addClass(`${$el.attr('disable_on_edit')} ${axns?.multi_purps?.cc?.[idx] || ''}`);
                    $('.tbl_multy_purps_w', tblContainer).addClass('border'); // must be here and not in teh HTML b/c we have border if there are elements
                    $('.tbl_multy_purps_w', tblContainer).append($el);
                });
            });
        }
        // </editor-fold>
        //#endregion
        // </editor-fold>

        this.AdditionalTabulatorInitOptions.iTr_init_end?.(this, $('> .table-header-toolbar_w', this.tableContainerElement));

        // <editor-fold defaultstate="collapsed" desc=" COMMENT: tbl Master Search ">
        //#region -tbl Master Search

        // let mFilter_width = this.fTbl_controlers.find(obj => obj.tblSearch)?.tblSearch?.input_w;
        // <editor-fold defaultstate="collapsed" desc=" COMMENT: Function to search table, for local tables ">
        //#region -Function to search table, for local tables
        //        const iTr_searchTbl_local = (search) => {
        //            let selectedColumns = $('.dropdown-menu .dds_itemsList_w input:checked', tbl_MasterSearch_colsdDdown).toArray();
        //            let filters = selectedColumns.map(col => ({
        //                field: $(col).val(),
        //                type: "like",
        //                value: search
        //            }));
        //            // update the filter to trigger Tabulator search
        //            if(filters.length > 0){
        //                this.TabulatorObj.setFilter([filters]);
        //            }
        //
        //            // needed to update the status bar on table when doing local searching
        //            // this event is needed to get exact number of rows after filters
        //            this.updateStatus();
        //        };
        //#endregion
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" COMMENT: Function to search table, for remote tables ">
        //#region -Function to search table, for remote tables
        //        const iTr_searchTbl_remote = (search) => {
        //            // get selected filter columns
        //            // if none then use "*" (wildcard) (search all)
        //
        //            // const inputs = tbl_MasterSearch_colsdDdown.find('ul li input')
        //            //     .toArray()
        //            //     .filter((input) => {
        //            //         return $(input).prop('checked');
        //            //     });
        //
        //            let inputs = $('.form-check-input:checked', tbl_MasterSearch_colsdDdown).map(function() {
        //                return this; }
        //                ).get(); // convert the jQuery object into a plain array
        //
        //            const columnsToSearch = Array.from(inputs).map((input) => {
        //                return $(input).prop('value');
        //            });
        //
        //
        //            iConsole(columnsToSearch, { search });
        //
        //            const endPoint = new URL(this.AdditionalTabulatorInitOptions.masterFilterURL);
        //            this.additionalAjaxParams['master_search'] = true;
        //            this.additionalAjaxParams['search'] = search ? `*${search}*` : '';
        //            this.additionalAjaxParams['url'] = endPoint;
        //            this.additionalAjaxParams['columns'] = columnsToSearch.toString();
        //
        //            // trigger tabulator ajax manually
        //            this.TabulatorObj.setData();
        //        };
        //#endregion
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" COMMENT: on table's global search: form submit ">
        //#region -on table's global search: input change
        //        tbl_MasterSearch_w.find('form').on('submit', (e) => {
        //            iConsole("on table's global search: form submit ");
        //            e.preventDefault();
        //            // enable form-search always when enter-key is pressed.
        //            // if (!this.TableSettings.filter_by.on_enter.enabled){ return; }
        //
        //            const search = $(e.target).find('input').val();
        //            if (!search?.trim()) {
        //                return;
        //            }
        //
        //            if (this.initMode == 'paginated-local') {
        //                iTr_searchTbl_local(search);
        //            } else {
        //                iTr_searchTbl_remote(search);
        //            }
        //        });
        //#endregion
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" COMMENT: on table's global search: input change ">
        //#region -on table's global search: input change
        //        tbl_MasterSearch_w.find('form input').on('input', (e) => {
        //            iConsole("on table's global search: input change ");
        //            if ($(e.target).val() == "") {
        //                if (this.additionalAjaxParams['master_search']) {
        //                    this.additionalAjaxParams['master_search'] = false;
        //                    this.TabulatorObj.setData();
        //                }
        //                if (this.initMode == 'paginated-local') {
        //                    this.TabulatorObj.setFilter([]);
        //                }
        //            }
        //            if (this.TableSettings.filter_by.on_type.enabled) {
        //                if (this.initMode == 'paginated-local') {
        //                    iTr_searchTbl_local($(e.target).prop("value"));
        //                } else {
        //                    handleSearchDebounced.fn(e); // Needed to trigger the search for <on_type> flag with certain amount of delay.
        //                }
        //            }
        //        });
        //#endregion
        // </editor-fold>
        //#endregion
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" COMMENT: tbl_ColumsToggleVisib_menu ">
        //#region -tbl_ColumsToggleVisib_menu
        /*
        const tbl_ColumsToggleVisib_menu = iGet_el_SelectDropdown({
            calling_for : "colsVisibility",
            el_w: { class: "col-auto px-0" },
            dd_title: {text: "Select which table columns to view"},
            dd_filter: { input: {placeholder: "Search column name..."}, show:".chboxSelect"},
            dd_select_list: { data: this.getTableColumns(), exludeBy: "cv" },
            applayBtns: { show: 0 },            
            fn_onInptChkChange: (e)=>{                
                const val = e.target.value;
                const ele = tbl_MasterSearch_colsdDdown.find(`.dds_itemsList_w input[value=${val}]`);
                iConsole("ColumsToggleVisib, onInptChkChange", e.target,ele);

                if (!e.target.checked) {
                    this.TabulatorObj.hideColumn(val);
                    if (this.TableSettings.persist_column_visibility.enabled && !this.DefaultHiddenColumns.includes(val)) {
                        this.TableSettings.persist_column_visibility.hiddenColumns.push(val);
                    }

//                    ele.closest(".form-check").attr({'data-hidden-from-menu': true});
                    ele.closest(".form-check").attr({"data-hidden-from-menu": true, "data-hidden-by-col_view": true});
                    $(ele).prop('checked', true); // We are doing the true because ".click" is doing its work and making check to uncheck
                    $(ele).click();
                } else {
                    // show column
                    this.TabulatorObj.showColumn(val);
                    if (this.TableSettings.persist_column_visibility.enabled && !this.DefaultHiddenColumns.includes(val)) {
                        const idx = this.TableSettings.persist_column_visibility.hiddenColumns.indexOf(val);
                        if (idx != -1) {
                            this.TableSettings.persist_column_visibility.hiddenColumns.splice(idx, 1);
                        }
                    }                    

                    ele.closest(".form-check").attr({"data-hidden-from-menu": false, "data-hidden-by-col_view": false});
                    $(ele).prop('checked', false); // We are doing the false because ".click" is doing its work and making uncheck to check                    
                    $(ele).click();
                }
                Store.set(this.localStorageKey, this.TableSettings);
            }
        });*/
        //#endregion
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        //#region -COMMENT
        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        //#region -COMMENT
        // $('li input', tbl_ColumsToggleVisib_menu).click((e) => {
        //     iConsole("searching-----");
        //     // hide column
        //     const val = e.target.value;
        //     if (!e.target.checked) {
        //         this.TabulatorObj.hideColumn(val);
        //         if (this.TableSettings.persist_column_visibility.enabled && !this.DefaultHiddenColumns.includes(val)) {
        //             this.TableSettings.persist_column_visibility.hiddenColumns.push(val);
        //         }
        //         // hiding the li element from tbl_MasterSearch_colsdDdown for columns search
        //         tbl_MasterSearch_colsdDdown.find(`ul li input[value=${val}]`)
        //             .prop('checked', false) // uncheck input for Masterfilter
        //             .parent()
        //             .parent()
        //             .attr('data-hidden-from-menu', true);
        //     } else {
        //         // show column
        //         this.TabulatorObj.showColumn(val);
        //         if (this.TableSettings.persist_column_visibility.enabled && !this.DefaultHiddenColumns.includes(val)) {
        //             const idx = this.TableSettings.persist_column_visibility.hiddenColumns.indexOf(val);
        //             if (idx != -1) {
        //                 this.TableSettings.persist_column_visibility.hiddenColumns.splice(idx, 1);
        //             }
        //         }
        //         // un-hiding the li element
        //         tbl_MasterSearch_colsdDdown.find(`ul li input[value=${val}]`).parent().parent().attr('data-hidden-from-menu', false);
        //     }

        //     const checkedInputs = visibilityInputs.filter(input=>{
        //         return input.checked
        //     });

        //     if(checkedInputs.length == 0){
        //         $('.selectDeselecTtoggle i', tbl_ColumsToggleVisib_menu).prop("class",i_el_cc["none-selected"]);
        //     }
        //     if(checkedInputs.length >= 1 && checkedInputs.length < visibilityInputs.length){
        //         $('.selectDeselecTtoggle i', tbl_ColumsToggleVisib_menu).prop("class",i_el_cc["partial-selected"]);

        //     }
        //     if(checkedInputs.length == visibilityInputs.length){
        //         $('.selectDeselecTtoggle i', tbl_ColumsToggleVisib_menu).prop("class",i_el_cc["all-selected"]);
        //     }

        //     Store.set(this.localStorageKey, this.TableSettings);
        // });
        //#endregion
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        //#region -COMMENT
        // row-selection dropdown
        /* const UniqueRowSelectDropdown = iGet_el_SelectDropdown({
            applayBtns: {
                show:1,
                cancel:{show:0},
                apply:{show:1}
            },
            ctrlBtns: {}
        });
//        $(this.tableContainerElement).find('.settings-container').append(UniqueRowSelectDropdown);

        const uniqueLocations = [...new Set(this.TabulatorObj.getData().map(item => item.location))].sort();
        iConsole({uniqueLocations});
        
        $('ul.dropdown-menu .dds_itemsList_w',UniqueRowSelectDropdown).append(`
            <li>
                <label class="dropdown-item dropdown-item-marker"><input type="checkbox" value="sdf"> <span>sdff</span></label>
            </li>`);
        uniqueLocations.forEach((col) => {
            $('ul.dropdown-menu .dds_itemsList_w',UniqueRowSelectDropdown).append(`
                <li>
                    <label class="dropdown-item dropdown-item-marker"><input type="checkbox" value="${col}"> <span>${col}</span></label>
                </li>`);
        });
        $('ul.dropdown-menu .dds_itemsList_w li input',UniqueRowSelectDropdown).change((e) => {
            // select rows
            const val = e.target.value
            if(e.target.checked){     
                // select rows
                this.TabulatorObj.getRows().map((row)=>{
                    if(row.getData().location == "India"){
                        row.select();
                    }else{
                        row.deselect();
                    }
                });

            }else{
                this.TabulatorObj.getRows().map((row)=>{
                    if(row.getData().location == "India"){
                        row.deselect();
                    }
                });
            }
        });*/
        //#endregion
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc=" COMMENT: old-logic ">
        //#region -COMMENT: old-logic
        // old-logic

        // VisibilityDropdownMenu.append(`<li><a class="dropdown-item btn-sm" href="#" data-value="${item.field}" data-hidden=${
        // this.TableSettings.persist_column_visibility.enabled
        //     ? this.TableSettings.persist_column_visibility.hiddenColumns.includes(item.field)
        //     : false
        // } data-hidden-from-menu=${item.hiddenFromMenu}>
        //         ${item.title}
        //     </a></li>`);

        // VisibilityDropdownMenu.find('li').click((e) => {
        //     const val = $(e.target).data().value;

        //     // restore column
        //     if (val == 'restore-cols-visibility') {
        //         [...$(VisibilityDropdownMenu).find("a[data-hidden='true']")].forEach((item) => {
        //             const colName = item.getAttribute('data-value');
        //             if (item.getAttribute('data-hidden-from-menu') != 'true') {
        //                 this.TabulatorObj.showColumn(colName);
        //             }
        //             item.setAttribute('data-hidden', false);
        //             tbl_MasterSearch_colsdDdown.find(`ul li input[value=${colName}]`).parent().parent().attr('data-hidden-from-menu', false);
        //         });
        // if (this.TableSettings.persist_column_visibility.enabled) {
        //     this.TableSettings.persist_column_visibility.hiddenColumns = [];
        // }
        //     } else {
        //         // hide columns
        //         const active = e.target.getAttribute('data-hidden');
        //         if (!active || active == 'false') {
        //             this.TabulatorObj.hideColumn(val);
        //             e.target.setAttribute('data-hidden', true);
        // if (this.TableSettings.persist_column_visibility.enabled && !this.DefaultHiddenColumns.includes(val)) {
        //     this.TableSettings.persist_column_visibility.hiddenColumns.push(val);
        // }
        // // hiding the li element
        // tbl_MasterSearch_colsdDdown.find(`ul li input[value=${val}]`)
        //     .prop('checked', false)
        //     .parent()
        //     .parent()
        //     .attr('data-hidden-from-menu', true);
        //         } else {
        //             this.TabulatorObj.showColumn(val);
        //             e.target.setAttribute('data-hidden', false);
        // if (this.TableSettings.persist_column_visibility.enabled && !this.DefaultHiddenColumns.includes(val)) {
        //     const idx = this.TableSettings.persist_column_visibility.hiddenColumns.indexOf(val);
        //     if (idx != -1) {
        //         this.TableSettings.persist_column_visibility.hiddenColumns.splice(idx, 1);
        //     }
        // }
        // // un-hiding the li element
        // tbl_MasterSearch_colsdDdown.find(`ul li input[value=${val}]`).parent().parent().attr('data-hidden-from-menu', false);
        //         }
        //     }
        //     Store.set(this.localStorageKey, this.TableSettings);
        // });
        //#endregion
        // </editor-fold>

        //#endregion
        // </editor-fold>
    }
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" fn: resizeNestedTable ">
    //#region fn: initTabulatorEvents
    resizeNestedTable = (tableElement) => {
        const tableContentHeight = $('.tabulator-table', tableElement).height() || 150;
        const tableheaderHeight = $('.tabulator-headers', tableElement).height();
        const tableFooter = $('.tabulator-footer', tableElement);
        const tableFooterheight = tableFooter.height() + 25;

        const cHeight = tableContentHeight + tableheaderHeight + tableFooterheight;
        if (tableElement.length && this.iTr_expTbl && (tableContentHeight < $('.tabulator-tableholder', tableElement).height() || tableContentHeight < cHeight)) {
            if (this.iTr_expTbl_MinHeight && this.iTr_expTbl_MinHeight > cHeight) {
                this.TabulatorObj.setHeight(this.iTr_expTbl_MinHeight);
            } else {
                this.TabulatorObj.setHeight(tableContentHeight + tableheaderHeight + tableFooterheight);
            }
        }
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" fn: groupBy_headerClick ">
    //#region fn: groupBy_headerClick
    groupBy_headerClick = (e, column) => {
        const table = column.getTable();
        const field = column.getField();
        const currentSort = table.getSorters();

        const excludedColumnField = Array.isArray(table.options.groupBy) ? table.options.groupBy : [table.options.groupBy];

        const sortInc_GrBy = currentSort.filter((sort) => excludedColumnField.includes(sort.field));
        if (sortInc_GrBy.length) {
            // in case we have more then 1 sort, the table sorts will contain also the GroupBy and we do not need to re-set the sort = re-run the table sort
            return;
        }

        const newSort = currentSort.filter((sort) => !excludedColumnField.includes(sort.field));
        table.options.initialSort.forEach((sort) => {
            if (excludedColumnField.includes(sort.column.getField())) {
                newSort.unshift({ column: sort.column.getField(), dir: sort.dir });
            }
        });
        table.setSort(newSort);
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" fn: initTabulatorEvents ">
    //#region fn: initTabulatorEvents
    initTabulatorEvents = () => {
        // needed in remote-tables to restore back the editing row, when it is getting new data.
        this.TabulatorObj.on('dataLoading', this.saveEditedRowData);

        this.TabulatorObj.on('dataProcessing', (newProcessedPageData) => {
            //  triggered after data has been processed and the table has been rendered and before format row
            this.updateCurrentPageDate(newProcessedPageData);
        });
        // <editor-fold defaultstate="collapsed" desc=" Tr event: dataProcessed ">
        this.TabulatorObj.on('dataProcessed', (newProcessedPageData) => {
            //  triggered after data has been processed and the table has been rendered
            iConsole('--- data processed  --------', this.selectedRowsSet);
            iConsole({ newProcessedPageData });
            // this.updateCurrentPageDate(newProcessedPageData);
            this.restoreSelectedRowsState();

            if (this.TabulatorObj.getData()[0]?.hasOwnProperty('is_row_selected')) {
                this.TabulatorObj.getRows().forEach((row) => {
                    if (row.getData().is_row_selected) {
                        this.selectRowAndCheckInput(row, false);
                    }
                });
            }
            //            this.hasUserFiltered = true;
        });
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" Tr event: renderComplete ">
        // Run eash time after sorting, filter and so
        // It is needed to disable the rows when editing is enabled and loading new rows for remote tables.
        // it gets run when sorting, search and pagination for remote and local tables
        this.TabulatorObj.on('renderComplete', () => {
            iConsole('------------ render-complete --------------', this.TabulatorObj.getData(), 'this.isEditing', this.isEditing);

            // this.toggleAllTblRowsToCheck();
            // this.toggleAllRowsChkBox(true);

            // toggle disable state of row-expand and row-select btns for the visible rows.
            this.TabulatorObj.getRows('visible').forEach((row) => {
                // if editing is enabled, then disable row-expand and row-select elements in the row element.
                if (this.isRowExpandColPresent) {
                    $('button', row.getCell('rowExpand').getElement()).prop('disabled', this.isEditing);
                }
                if (this.isRowSelectionColPresent && row?._getSelf()?.type === 'row') {
                    $('input', row.getCell('rowSelection').getElement()).prop('disabled', this.isEditing);
                }
            });

            if (this.isEditing) {
                this.freezeCurrentEditingRow();
                // $('[tabulator-field="chbox"]', '.edit-row-visulizer').click();
            }

            if ($(this.TabulatorObj.element).closest('.iTr_F_01').length) {
                // adding bootstrap class to giving styles for header filter elements
                $('.tabulator-header-filter input').addClass('form-control form-control-sm');
                $('.tabulator-header-filter select').addClass('form-select-sm');
            }

            if (this.AdditionalTabulatorInitOptions.iTr_moveRowSelectionOnKeyDown) {
                // restore focus if row is selected
                // needed to work move the selection with <keyleft> and <keyright>
                this.focusToSelectedRowInput();
            }
            if (!this.iTr_tableBuilded) {
                this.TabulatorObj.dispatchEvent('iTr_tableHeaderBuild');
                this.iTr_tableBuilded = true;
                $('.tbl_master_search-input', this.tableContainer).focus();
            }
        });
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" Tr event: tableBuilt ">
        this.TabulatorObj.on('tableBuilt', (newProcessedPageData) => {
            const tableElement = $(this.TabulatorObj.element);
            this.resizeNestedTable(tableElement);
        });
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" Tr event: dataFiltering ">
        this.TabulatorObj.on('dataFiltering', (filters) => {
            const container = $(this.tableContainer);
            if (filters.length) {
                container.find('.masterFilter_clear').not(container.find('.table-container .masterFilter_clear')).prop('disabled', false);
            } else {
                container.find('.masterFilter_clear').not(container.find('.table-container .masterFilter_clear')).prop('disabled', true);
            }
        });
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc=" Tr event: dataFiltered ">
        // update master-row selection based on filter
        this.TabulatorObj.on('dataFiltered', (filters, rows) => {
            // hide dropdown and popover on data filtering
            iBS_hideAll_Dropdowns();
            iBS_hideAll_Popovers();

            // console.log({filters}, this.TabulatorObj.getHeaderFilters())

            // getting the total count the disabled rows
            this.iTr_disabled_rows_count = rows.filter((row) => {
                return row.getData().is_disabled === true;
            }).length;

            // $(`.master-row-selection-header`, $(this.TabulatorObj.element.closest(".table-container"))[0]).prop({"checked": 0, "indeterminate": 0});
            if (filters.length > 0) {
                this.filtered_tbl_data = rows;
            } else {
                // if(this.TabulatorObj.getSelectedRows().length > 0){
                //     $(`.master-row-selection-header`, $(this.TabulatorObj.element.closest(".table-container"))[0]).prop({"checked": 0, "indeterminate": 1});
                // }
                this.filtered_tbl_data = [];
            }
            // updating the master-select check status when filtering is done.
            this.onRowSelectDeselect();

            // Updating the unique select-dropdowns on data-filter event to show the updated list with correct data counts.
            Object.keys(this.uniqueSelectDropdowns.headerFilters).forEach((dropdown_key) => {
                const data = filters.length > 0 ? this.filtered_tbl_data.map((row) => row.getData()) : this.TabulatorObj.getData();

                const dropdown = generate_selectDD_withUniqueList(data, { keyToMatch: dropdown_key, CustomTabulator: this });
                $(`.${dropdown_key}_header_select`, this.TabulatorObj.element).empty().append(dropdown);

                this.uniqueSelectDropdowns.headerFilters[dropdown_key] = dropdown;
            });
        });
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" Tr event: scrollVertical ">
        // fix for disabling all of the checkboxes when row-editing is enabled for local tables.
        // need as the disabl logic inside editMode handler is not working for local tables.
        this.TabulatorObj.on('scrollVertical', () => {
            iBS_hideAll_Dropdowns();
            iBS_hideAll_Popovers();
            // this.toggleAllTblRowsToCheck();

            // check and select the visible rows, when is_row_selected is true for the row.
            this.TabulatorObj.getRows('visible')
                .filter((row) => row?._getSelf()?.type === 'row')
                .forEach((row) => {
                    if (row.getData().is_row_selected) {
                        this.selectRowAndCheckInput(row);
                    }
                    if (row.getData().is_row_selected === false) {
                        this.selectRowAndCheckInput(row, false, true);
                    }

                    // if editing is enabled, then disable row-expand and row-select elements in the row element.
                    if (this.isRowExpandColPresent) {
                        $('button', row.getCell('rowExpand').getElement()).prop('disabled', this.isEditing);
                    }
                    if (this.isRowSelectionColPresent) {
                        $('input', row.getCell('rowSelection').getElement()).prop('disabled', this.isEditing);
                    }

                    if (this.currentSelectedRows.length == 1 && this.AdditionalTabulatorInitOptions.iTr_multi_row_select_disable) {
                        if (row == this.currentSelectedRows[0]) {
                            return;
                        }
                        if (this.isRowExpandColPresent) {
                            $('button', row.getCell('rowExpand').getElement()).prop('disabled', true);
                        }
                        if (this.isRowSelectionColPresent) {
                            $('input', row.getCell('rowSelection').getElement()).prop('disabled', true);
                        }
                    }
                });

            // not using this.
            /* if(this.isEditing){
                this.toggleAllRowsChkBox(true);
            }*/

            //            this.updateStatus();
        });
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" Tr event: rowSelectionChanged ">
        this.TabulatorObj.on('rowSelectionChanged', (data, rows) => {
            // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
            // this.timers.rowSelectionChanged.fn(()=>{
            //     this.trackRowsSelection(data, rows);

            //     iBS_hideAll_Popovers();
            //     iBS_hideAll_Dropdowns();
            // })
            // iConsole('rowSelectionChanged');
            // this.trackRowsSelection(data, rows);
            // </editor-fold>

            iBS_hideAll_Popovers();
            iBS_hideAll_Dropdowns();
        });
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" Tr event: rowSelected ">
        this.TabulatorObj.on('rowSelected', (row) => {
            console.log('rowSelected');
            // const id = row.getData()[this.TabulatorObj.options.index] ?? null;
            // if (id == null) {
            //     return;
            // }
            // this.selectedRowsSet.add(id);

            if (row.getCell('rowExpand')) {
                $('button', row.getCell('rowExpand').getElement()).prop('disabled', true);
            }

            this.AdditionalTabulatorInitOptions.iTr_rowselectionChanged?.(row);
        });
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" Tr event: rowDeselected ">
        this.TabulatorObj.on('rowDeselected', (row) => {
            console.log('rowDe-Selected');
            // workaround for enabling the free-form selection of the text for the table cells
            // if($(".tabulator-cell[tabindex]", row).length){
            // row.getCells().forEach((cell) => {
            //     $(cell.getElement()).removeAttr('tabindex');
            // });
            // }

            // using options.index, it's default value is id.
            // We are getting the id of the row and we use incase if we change the index property to something else value, then it will be dynamic
            if (row.getCell('rowExpand')) {
                $('button', row.getCell('rowExpand').getElement()).prop('disabled', false);
            }

            const id = row.getData()[this.TabulatorObj.options.index] ?? null;
            if (id == null) {
                return;
            }
            // this.selectedRowsSet.delete(id);

            if (this.isEditing) {
                const idArr = this.currentPageData.map((data) => data.id);
                // needed to delete the editing row when it's not present in the page-data which is loaded in the Tabulator
                // this would only run when filtering or sorting is done, or change pagination
                //                if (!idArr.includes(row.getData().id) && this.hasUserFiltered) {
                if (!idArr.includes(row.getData().id)) {
                    //                    iConsole('---  deleting row with id  --->', row.getData().id);
                    this.TabulatorObj.deleteRow(row.getData().id);
                }
            }

            this.AdditionalTabulatorInitOptions.iTr_rowselectionChanged?.(row);
        });
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" Tr event: cellDblClick ">
        this.TabulatorObj.on('cellDblClick', (e, cell) => {
            shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_cellDblClick, e, cell);
        });
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" Tr event: dataLoaded ">
        // Update the status row whenever the table data is updated
        this.TabulatorObj.on('dataLoaded', () => {
            if (this.iTr_tableBuilded && !this.isResettingFilters) {
                this.resetFilter();
            }
            this.updateStatus();
        });
        // </editor-fold>
        this.TabulatorObj.on('dataChanged', this.updateStatus);
        this.TabulatorObj.on('rowAdded', this.updateStatus);
        this.TabulatorObj.on('rowDeleted', this.updateStatus);
        this.TabulatorObj.on('rowUpdated', this.updateStatus);
        this.TabulatorObj.on('renderComplete', this.updateStatus);
        this.TabulatorObj.on('scrollVertical', this.updateStatus);

        // Handle cell edit
        // this.TabulatorObj.on('cellEdited', (cell) => {
        //     const updatedData = cell._cell.row.data;
        //     this.TabulatorObj?.updateData([{ ...updatedData, isUpdated: true }]);
        // });

        // Update the status row initially
        // this.updateStatus();

        // <editor-fold defaultstate="collapsed" desc=" iTr event: iTr_showSortingBadgeNumber ">
        // add sorting event, for adding the sorting badge number.
        if (this.AdditionalTabulatorInitOptions.iTr_showSortingBadgeNumber) {
            this.TabulatorObj.on('dataSorting', (sorters) => {
                const excludedColumnField = Array.isArray(this.TabulatorObj.options.groupBy)
                    ? this.TabulatorObj.options.groupBy
                    : [this.TabulatorObj.options.groupBy];
                const filteredSorters = this.TabulatorObj.options.groupBy
                    ? sorters.filter((sort) => !excludedColumnField.includes(sort.field))
                    : sorters;
                // add badge on multiple sorting
                if (filteredSorters.length <= 1) {
                    $('.custom-badge', this.tableContainerElement).remove();
                } else {
                    //                if(sorters.length > 1){
                    filteredSorters.forEach((sort, idx) => {
                        // do not add to first sorted
                        // if(idx == 0) return;   // enable this to not show for first sorter.

                        // first find the badge element
                        let idx_str = idx + 1;
                        const badge_ele = $('.custom-badge', sort.column.getElement());
                        // console.log(badge_ele)
                        // if not founnd, then add the badge element
                        if (badge_ele.length == 0) {
                            const d = `<span class="custom-badge position-absolute badge rounded-pill text-secondary _bg-secondary d-inline-block" style="right:-2px;">${idx_str}</span>`;
                            $(sort.column.getElement()).append(d);
                        } else {
                            // if found, then update the counter only
                            $(badge_ele).text(idx_str);
                        }
                    });
                }
            });

            // handle multiple sort
            this.TabulatorObj.on('headerClick', (e, column) => {
                let sorters = this.TabulatorObj.modules.sort.sortList;
                const colDef = column.getDefinition();
                this.sortCount[colDef.field] = this.sortCount[colDef.field] ? this.sortCount[colDef.field] + 1 : 1;
                if (this.sortCount[colDef.field] >= 3 && sorters.length > 1) {
                    e.preventDefault();
                    this.sortCount[colDef.field] = 0;
                    $('.custom-badge', column.getElement()).remove();
                    $(column.getElement()).attr('aria-sort', 'none');

                    //if we sort by multiple columns and remove 1 column, we will remove the column name from the list but will not cause resorting to the table
                    this.TabulatorObj.modules.sort.sortList = sorters.filter((cSort) => cSort.field !== colDef.field);
                }
            });
        }
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" iTr event: iTr_tableHeaderBuild -> header, add select dropdown ">
        //#region -header, add select dropdown
        // in column definition remove the: width and headerFilter
        // +i+ iTr_headerFilter_by_ddFilter here we create all
        const tempTable = this;
        this.TabulatorObj.on('iTr_tableHeaderBuild', () => {
            if (tempTable) {
                const iTr_filterDropdownColumns = tempTable.getTableColumns().filter((column) => column?.iTr_headerFilter_by_ddFilter);
                let uniqueData_for_filters = getUniqueAttributes(
                    tempTable.TabulatorObj.getData(),
                    tempTable.getTableColumns().map((field) => field.field)
                ); //list ALL fileds that we are asking to have filter to them
                const dropdownFilters = iTr_filterDropdownColumns.map((item) => {
                    // const uniqueRecords = getUniqueCounts(tempTable.TabulatorObj.getData(), item.field); // fetching all table data with rec_name counts
                    // let uniqueRecordsArray = createDropdownArray(uniqueRecords, item.attributeKey); // fetching unique rec_name in every row
                    const filter = {
                        field: item.field,
                        type: 'in',
                        value: [],
                        uniqueArr: [],
                        containerId: item.headerId,
                        dropdownId: item?.headerDropdownId,
                        click: item?.iTr_headerFilter_by_ddFilter_fn,
                        dd_type: item?.iTr_headerFilter_by_ddFilter?.type,
                        iTr_dropdown_ops: item?.iTr_headerFilter_by_ddFilter?.iTr_dropdown_ops,
                    };

                    return filter;
                });
                if (iTr_filterDropdownColumns?.length) {
                    tempTable.TabulatorObj.on('dataFiltering', function (data) {
                        // managing the filter's badge (numbering)
                        const filters = tempTable.TabulatorObj.getFilters();
                        // check if more than one filter is applied
                        const appliedFilters = filters.filter((filter) => {
                            if (dropdownFilters.find((dropdownFilter) => dropdownFilter.field === filter.field && filter?.value?.length)) {
                                return true;
                            }
                            return false;
                        });
                        dropdownFilters.forEach((filter) => {
                            // Get the column element
                            const colElement = $(`.dropdown`, tempTable.TabulatorObj.getColumn(filter.field).getElement());

                            // Find the index of the current filter
                            const filterIndex = appliedFilters.findIndex((tablefilter) => tablefilter.field === filter.field);

                            // Remove existing badge
                            $('.badge', colElement).remove();

                            // If the filter exists, create a new badge
                            if (filterIndex >= 0 && appliedFilters?.length > 1) {
                                const badge = $(`<span class="badge text-primary">${filterIndex + 1}</span>`);
                                badge.addClass('translate-middle');
                                badge.css('position', 'absolute'); // Optionally, use a class for styling
                                //badge.css('margin', '7px'); // Optionally, use a class for styling
                                //                                badge.css('right', '0%'); // Optionally, use a class for styling
                                badge.css('right', '-6px'); // Optionally, use a class for styling
                                badge.css('z-index', 2);
                                colElement.append(badge);
                            }
                        });
                        //data - the data loading into the table
                    });

                    /** creating dropdown */
                    dropdownFilters.forEach((filter, index) => {
                        const { dropdown, getTableInstance } = createTableDropdown(
                            'Filter by',
                            'Filter by',
                            filter.field,
                            filter,
                            index,
                            filter.dd_type
                        );
                        dropdown.css({ position: 'relative' });
                        ('.dropdownMenuButton', dropdown).on('click', () => handleFilterClick(dropdown, filter, filter.field));
                        const resetButton = createResetButton(
                            () => resetDropdown(index, filter.field, dropdown, getTableInstance),
                            filter.dropdownId
                        );
                        resetButton.prop('disabled', true);
                        resetButton.css({ width: '40px' });
                        appendDropdownToHeader(dropdown, resetButton, filter.containerId);
                        filter.dropdown = dropdown;
                    });
                }

                this.TabulatorObj.on('iTr_tableHeaderRebuild', (columnToRender) => {
                    const index = dropdownFilters.findIndex((col) => col.field === columnToRender);
                    if (index >= 0) {
                        const filter = dropdownFilters[index];
                        const { dropdown, getTableInstance } = createTableDropdown(
                            'Filter by',
                            'Filter by',
                            filter.field,
                            filter,
                            index,
                            filter.dd_type
                        );
                        dropdown.css({ position: 'relative' });
                        ('.dropdownMenuButton', dropdown).on('click', () => handleFilterClick(dropdown, filter, filter.field));
                        const resetButton = createResetButton(
                            () => resetDropdown(index, filter.field, dropdown, getTableInstance),
                            filter.dropdownId
                        );
                        resetButton.prop('disabled', true);
                        resetButton.css({ width: '40px' });
                        appendDropdownToHeader(dropdown, resetButton, filter.containerId);
                        filter.dropdown = dropdown;
                    }
                });

                function getDropDownButton(field) {
                    return $(`#${field}_reset_button`);
                }

                function resetDropdown(filterIndex, field, dropdown, getTable) {
                    const filterBtnText = $('.dropdownMenuButton', dropdown);
                    let filters = tempTable.TabulatorObj.getFilters();

                    filters = filters.filter(
                        /*
                         * The first part of the function is for the regular tabulator filter
                         * The second part is for teh custumized filter = our own customized filters
                         * using: iTr_headerFilter_by_ddFilter: { .. iTr_dropdown_ops: {..  fn_onDropdownClick:{
                         * this filter is a function, and here we need to remove it.
                         * We identify it by: (typeof f.type === 'object' && f.type.iTr_custumize_filter && f.type.field !== field)
                         * which we set it once we created the filter
                         * CustomTabulator.TabulatorObj.setFilter((data) => myCustomFilter(selectedValues, data), {"iTr_custumize_filter": 1, field: "dytyName"});
                         *
                         */
                        (f) =>
                            (typeof f.field === 'string' && f.field !== field) ||
                            (typeof f.type === 'object' && f.type.iTr_custumize_filter && f.type.field !== field)
                    );

                    dropdownFilters[filterIndex].value = [];
                    tempTable.TabulatorObj.setFilter(filters);
                    filterBtnText.text('Filter by').removeClass('fw-bold');
                    getDropDownButton(dropdownFilters[filterIndex].dropdownId).prop('disabled', true);
                    const table = getTable();
                    if (table) {
                        table.deselectRow();
                        table.redraw(true);
                    }
                    const dropdownToggle = $('.dropdownMenuButton', dropdown);
                    bootstrap.Dropdown.getInstance(dropdownToggle)?.hide();
                }
                /**
                 * @description - to check if filter contains field value or not
                 * @param filters - dropdown filter
                 * @param data - field data
                 * @returns boolean
                 */
                function checkFilters(filters, data) {
                    return filters.every((filter) => {
                        if (Array.isArray(filter)) {
                            return filter.some((subFilter) => {
                                // Apply filter and return true if any subFilter matches
                                return deepCheck(subFilter, data);
                            });
                        } else {
                            // Other types can be handled here
                            return deepCheck(filter, data);
                        }
                    });
                }

                function deepCheck(filter, data) {
                    // +i+ Filter:
                    // for regex in order to add it we need to use setFilter and after that add filter
                    //      iTr_irLocal.TabulatorObj.addFilter('name', 'regex', 'awesome');
                    // for the other types
                    //    iTr_irLocal.TabulatorObj.addFilter({
                    //        "field": "name",
                    //        "type": "like", // type = [like | = | in ]
                    //        "value": "awesome"
                    //    })

                    const { field, type, value } = filter;

                    // Handle 'like' type (substring match)
                    if (type === 'like') {
                        return data[field]
                            ?.toString()
                            ?.toLowerCase()
                            ?.includes(value?.toString()?.toLowerCase() || '');
                    }

                    if (type === '=') {
                        return data[field]?.toString()?.toLowerCase() === value?.toString()?.toLowerCase();
                    }
                    // Handle 'in' type (value inclusion check)
                    if (type === 'in') {
                        return data[field] && value.includes(data[field]);
                    }

                    if (type === 'regex') {
                        try {
                            const regex = new RegExp(value, 'i'); // Case-insensitive match
                            return regex.test(data[field]?.toString() || '');
                        } catch (e) {
                            return false;
                        }
                    }

                    if (typeof type === 'function') {
                        return tempTable.deepMatchHeaderFilterfunction(value, data[field], data, { field }); // for header filter
                    }

                    if (typeof field === 'function') {
                        return field(data); // for master search
                    }

                    // Handle other types if needed
                    return false;
                }

                const getDynamicData = (dropdownId) => {
                    uniqueData_for_filters = getUniqueAttributes(
                        tempTable.TabulatorObj.getData(),
                        tempTable.getTableColumns().map((field) => field.field)
                    );
                    const uniqueRecords = getUniqueCounts(tempTable.TabulatorObj.getData(), dropdownId); // fetching all table data with rec_name counts
                    createDropdownArray(uniqueRecords, dropdownFilters.find((field) => field.field === dropdownId)?.uniqueArr || []);
                    const filters = tempTable.TabulatorObj.getFilters(true).filter(
                        (filter) =>
                            (filter.field !== dropdownId && filter?.value?.length) ||
                            Array.isArray(filter) ||
                            (!(typeof filter.type === 'object' && filter.type.iTr_custumize_filter) && typeof filter.field === 'function')
                    );
                    const dropdownOptions = uniqueData_for_filters.filter((data) => {
                        return checkFilters(filters, data);
                    });

                    dropdownFilters.forEach((filter) => {
                        if (filter.field === dropdownId) {
                            const existingData = new Set(dropdownOptions.map((item) => item[dropdownId]));
                            filter.uniqueArr.forEach((item) => {
                                if (!existingData.has(item.field)) {
                                    item.visible = false;
                                } else {
                                    item.visible = true;
                                }
                            });
                        }
                    });
                    // return filter.uniqueArr;
                };

                /**
                 *
                 * @param placeholder - dropdown placeholder
                 * @param dropdownId - dropdown id
                 * @param filter - dropdown filter object
                 * @param filterIndex - dropdown filter index
                 * @returns dropdown element
                 */
                // +i+ this is the calling and the default of the column's:  iTr_headerFilter_by_ddFilter: {type: 'multi-checkbox'}
                function createTableDropdown(title, placeholder, dropdownId, filter, filterIndex, type) {
                    const dropdown = createDropdownForTable(
                        $.extend(
                            true,
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
                                iTr_cellDblClick: true,
                                reactiveData: true, // in order that changes will be reflected in the dd tabulator
                                dd_select_list: { id: filter.dropdownId, deselectAll: true },
                                //  not clear if and when we use them class_name, style_name
                                fn_beforeDropdownShow: (e, table) => {
                                    getDynamicData(dropdownId);
                                    if (table) {
                                        table.refreshFilter();
                                    }
                                },
                                // iTr_minHeight: 1000,
                                iTr_ddList: { type },
                                iTr_table_index: 'title',
                                iTr_field_name: 'title',
                                fn_onDropdownClick: (row, selectedRows, table, dropdown) => {
                                    handleCheckboxChange(row, selectedRows, table, dropdown, filterIndex, dropdownId, type);
                                },
                                iTR_filter: [
                                    {
                                        field: 'visible',
                                        type: '=',
                                        value: true,
                                    },
                                ],
                                dd_moveToBody: true,
                            },
                            filter.iTr_dropdown_ops || {}
                        ),
                        filter.uniqueArr
                    );
                    $(`#${dropdownId}`).addClass('show');
                    return dropdown;
                }
                function handleCheckboxChange(row, selectedRows, table, dropdown, filterIndex, field, type) {
                    // updating the dd calling btn text [Filter by | Apply Filter | .. ]
                    const filterBtnText = $('.dropdownMenuButton', dropdown);
                    dropdownFilters[filterIndex].value = selectedRows.map((currentRow) => {
                        return currentRow.getData()['field'];
                    });
                    updateFilterButtonText(filterBtnText, dropdownFilters[filterIndex].dropdownId);
                }

                /**
                 * Update filter button text on value change
                 * @param filterBtnText - updated text
                 * @param field - In which filter button we need to update
                 */
                function updateFilterButtonText(filterBtnText, field) {
                    filterBtnText.text('Apply Filter').addClass('fw-bold');
                    getDropDownButton(field).prop('disabled', false);
                }

                /**
                 * @description handle filter button click
                 * @param dropdown - filter dropdown element
                 * @param filter - filter object
                 * @param field - filter field
                 */
                function handleFilterClick(dropdown, filter, field) {
                    const buttonText = $('.dropdownMenuButton', dropdown).text();
                    const dropdownToggle = $('.dropdownMenuButton', dropdown);

                    if (buttonText === 'Apply Filter') {
                        bootstrap.Dropdown.getInstance(dropdownToggle)?.hide();
                        applyFilter(dropdownToggle, filter, field);
                    }
                }

                function applyFilter(dropdown, filter, field) {
                    const filters = tempTable.TabulatorObj.getFilters();
                    const filterIndex = filters.findIndex((f) => f.field === field);
                    if (filterIndex >= 0) {
                        filters[filterIndex] = filter;
                    } else {
                        filters.push(filter);
                    }
                    tempTable.TabulatorObj.setFilter(filters);
                    dropdown.text('Applied filter').addClass('fw-bold');
                }
            }

            /**
             * @description - used to group data based on array of keys
             * @function getUniqueAttributes
             * @param arr - Array of dropdown data
             * @param keys - Keys to group data
             * @returns array of data
             */
            function getUniqueAttributes(arr, keys) {
                const seen = {};
                if (tempTable.AdditionalTabulatorInitOptions.dataTree) {
                    keys.push('_children');
                }
                return arr.reduce((result, item) => {
                    // Create a unique key based on selected attributes
                    const key = keys.map((k) => item[k]).join('|');
                    if (!seen[key]) {
                        seen[key] = true;
                        // Add only the selected attributes to the result
                        result.push(
                            keys.reduce((obj, k) => {
                                obj[k] = item[k];
                                return obj;
                            }, {})
                        );
                    }
                    return result;
                }, []);
            }

            /**
             * @param uniqueCounts - grouped dropdown data by field name
             * @description create dropdown option data
             * @returns array
             */
            function createDropdownArray(uniqueCounts, filter) {
                //                const sortedEntries = Object.entries(uniqueCounts).sort(([aName], [bName]) => aName.localeCompare(bName));
                let sortedEntries = Object.entries(uniqueCounts).sort((a, b) => {
                    // Ensure the HTML key is first
                    if (a[0].includes('<i') && b[0].includes('<i')) return 0;
                    if (a[0].includes('<i')) return -1;
                    if (b[0].includes('<i')) return 1;

                    return a[0].localeCompare(b[0]);
                });

                return sortedEntries.forEach(([name, id]) => {
                    //                return Object.entries(uniqueCounts).forEach(([name, id]) => {
                    const dataIndex = filter.findIndex((field) => field.field === name);

                    if (dataIndex < 0) {
                        filter.push({
                            field: name,
                            title: name,
                            id,
                            visible: true,
                        });
                    }
                });
            }

            /**
             * @description append dropdown in header cell
             * @param dropdown - dropdown element
             * @param button - dropdown button
             * @param headerClass - class name where we append dropdown
             */
            function appendDropdownToHeader(dropdown, button, headerId) {
                const headerSelect = $(`#${headerId}`, $(tempTable.TabulatorObj.element.closest(tempTable.tableContainer)))[0];
                $(headerSelect).addClass('d-flex align-items-stretch').css({ height: '31px' });
                $(headerSelect).empty().append(dropdown).append(button);
            }

            /**creat dropdown button */
            function createResetButton(onClick, field) {
                return $('<button>', {
                    id: `${field}_reset_button`,
                    class: 'iDDselnWfilter_btn form-control form-control-sm border py-1 reset_button text-secondary ms-1',
                    //                            html: '<i class="fa fa-redo"></i><i class="fa fa-rotate-right" data-test-el="1"></i>',
                    html: '<i class="fa fa-redo"></i>',
                    click: onClick,
                });
            }

            // Helper functions
            function getUniqueCounts(data, field) {
                return data.reduce((acc, obj) => {
                    // acc[obj[field]] = acc[obj[field]] ? acc[obj[field]] + '-' + obj.id : `${obj.id}`; // for in case we want the list of id belongs to this recored
                    // For in case we do not want to show empty data
                    // if ((obj[field]||'').trim()) {
                    //      acc[obj[field]] = true;
                    // }
                    acc[obj[field]] = true;
                    return acc;
                }, {});
            }
        });
        //#endregion
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" iTr event: iTr_clipboard_copy_after ">
        if (this.AdditionalTabulatorInitOptions.iTr_clipboard_copy_after) {
            this.TabulatorObj.on('clipboardPasted', (clipboard) => {
                // getting rows which are added by the clipboard, by comparing with old and new table rows.
                const new_rows = this.TabulatorObj.getRows().slice(this.currentPageData.length, this.TabulatorObj.getRows().length);
                this.currentPageData = this.TabulatorObj.getRows().map((row) => row.getData());

                this.AdditionalTabulatorInitOptions.iTr_clipboard_copy_after(new_rows);
                $(this.uploadCopiedRowsBtn).prop('disabled', false);
            });
        }
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" iTr event: iTr_moveRowSelectionOnKeyDown ">
        if (this.AdditionalTabulatorInitOptions.iTr_moveRowSelectionOnKeyDown) {
            $(this.tableContainerElement).keydown(this.moveRowSelectionOnKeyDown);
        }
        // </editor-fold>
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" fn: saveEditedRowData ">
    //#region - fn: saveEditedRowData
    saveEditedRowData = () => {
        const updatedRecords = this.TabulatorObj.getSelectedData()?.filter((data) => data?.isUpdated);
        iConsole({ updatedRecords }, '------- dataLoading -----------');
        const selecteRowSize = this.selectedRowsSet.size;

        if (this.isEditing && selecteRowSize == 1 && updatedRecords.length == 1) {
            this.editedRowData = updatedRecords[0];
        }
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" fn: restoreSelectedRowsState ">
    //#region - fn: restoreSelectedRowsState
    restoreSelectedRowsState = () => {
        const size = this.selectedRowsSet.size;
        if (size == 0) {
            return;
        }

        // restore selected row and its edit state
        // restore the values row which were in the edited mode
        if (size == 1 && this.isEditing) {
            const editedRowId = [...this.selectedRowsSet.values()][0];
            iConsole({ editedRowId, th: this.TabulatorObj.getRows() }, '-------------------------');

            let editedRow = this.TabulatorObj.getRow([...this.selectedRowsSet.values()][0]);
            iConsole({ editedRow });

            // if edited row not found, means we are doing filtering or changed the page number
            // then generate that row and freeze in editing mode
            if (!editedRow) {
                iConsole('--- not found, creating edited row with data : --> ', this.selecteRowStates.old_data);
                // add the editing row
                this.TabulatorObj.addRow({ ...this.selecteRowStates.old_data }).then((row) => {
                    // this.TabulatorObj.addRow({ ...this.selecteRowStates.old_data, isNew: true }).then((row) => {
                    row.freeze();
                    row.select();
                    iConsole('current selected row when process data -->', this.currentSelectedRows);
                    this.currentSelectedRows = [row];
                    this.enableEditMode();
                    //                    this.rowOperationsContainer.addClass('d-flex');
                    //                    this.rowOperationsContainer.removeClass('d-none');
                    this.toggleSingleRowOperationsContainer(true);
                    this.toggleDuplicateRowBtn(true);
                    this.toggleTbl_read_mode_w(false);

                    if (this.editedRowData && row) {
                        this.restoreEditedRowData(row);
                    }
                });
                return;
            }

            this.currentSelectedRows = [editedRow];
            this.enableEditMode();
            //            this.rowOperationsContainer.addClass('d-flex');
            //            this.rowOperationsContainer.removeClass('d-none');
            this.toggleSingleRowOperationsContainer(true);
            this.toggleDuplicateRowBtn(true);
            this.toggleTbl_read_mode_w(false);

            if (this.editedRowData && editedRow) {
                this.restoreEditedRowData(editedRow);
            }
        }
        // select all of the row which were selected before new dataLoad/render
        this.TabulatorObj.selectRow([...this.selectedRowsSet.values()]);
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" fn: restoreEditedRowData ">
    //#region - fn: restoreEditedRowData
    restoreEditedRowData = (row) => {
        if (this.editedRowData && this.isEditing) {
            row.update(this.editedRowData);
        }
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" iTr_setEditMode ">
    //#region -iTr_setEditMode
    iTr_setEditMode = (inputs = {}) => {
        let fn = { setTo: null, setMore: false, isNewRow: null, ...inputs };

        iConsole('------ iTr_setEditMode  -------------');

        this.toggleEditVisualizer(fn.setTo);
        this.toggleEnableEditModeBtn(fn.setTo);

        // Disabled this, we do not need to run loop on all table rows.
        // Just disable visible rows, and others will be disabled in scrollVertical event.
        // this.toggleAllRowsChkBox(fn.setTo);

        // this is replacement of above code.
        this.TabulatorObj.getRows('visible').forEach((row) => {
            if (this.isRowExpandColPresent) {
                $('button', row.getCell('rowExpand').getElement()).prop('disabled', fn.setTo);
            }
            if (this.isRowSelectionColPresent && row?._getSelf()?.type === 'row') {
                $('input', row.getCell('rowSelection').getElement()).prop('disabled', fn.setTo);
            }
        });
        this.isEditing = fn.setTo;

        let $disable_on_edit = $('.single-row-operations-container [disable_on_edit]');
        $disable_on_edit.prop('disabled', fn.setTo);
        if (fn.setTo) {
            $disable_on_edit.removeClass($disable_on_edit.attr('disable_on_edit'));
        } else {
            $disable_on_edit.addClass($disable_on_edit.attr('disable_on_edit'));
        }

        if (fn.setMore) {
            this.toggleTbl_read_mode_w(!fn.setTo);
            // adding it here to fix the collison with renderComplete event, it is disabling the checkbox again after disabling the edit mode
            //            this.isEditing = fn.setTo;
            this.rowDeselectSelectedRows(!fn.setTo, fn.isNewRow);

            // if iTr_multi_row_select_disable is false then enable the master-selection
            if (!this.AdditionalTabulatorInitOptions.iTr_multi_row_select_disable) {
                this.toggleMasterCheckBox(fn.setTo);
            }

            this.selecteRowStates.old_data = null;
            this.selectedRowsSet.clear();
            this.currentSelectedRows = [];
        }
        // should toggle buttons after all.
        this.toggleRowOperationsBtn(!fn.setTo);
        this.toggleDeleteRowBtn(!fn.setTo);
        setTimeout(() => {
            this.toggleDuplicateRowBtn(!fn.setTo);
        });

        //        this.isEditing = fn.setTo;
        this.AdditionalTabulatorInitOptions.iTr_setEditMode_end?.(fn.setTo);
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" fn: isFieldEditable ">
    //#region -fn: isFieldEditable
    isFieldEditable = (cell) => {
        //get row data
        // const data = cell.getRow();
        // return data?._row?.modules?.rowSelection?.selected;

        // workaround for enabling the free-form selection of the text for the table cells
        if (cell.getRow() != this.currentSelectedRows[0]) {
            cell.getElement().removeAttribute('tabindex');
        }
        // enable editing on only one selected row when clicked on edit-mode enable btn
        return this.isEditing && cell.getRow() == this.currentSelectedRows[0];
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" editor: headerDateEditor ">
    //#region -editor: headerDateEditor
    //    headerDateEditor = (cell, onRendered, success, cancel) => {
    headerDateEditor = (cell, onRendered, success, cancel, editorParams) => {
        editorParams = { type: 'date', ...editorParams };

        let ww = { date: 108, 'datetime-local': 170 };

        const $input = $(`<input class="h-100" type="${editorParams.type}" style="padding: 4px; width: ${ww[editorParams.type]}px;">`)
            .val(cell?.getValue())
            .on('change', function () {
                $btn.removeClass('d-none');
                success($(this).val());
            })
            .on('keydown', function (e) {
                handleKeyDown(e, () => success($(this).val()), cancel);
            });

        //        const $btn = $(`<button class="position-relative d-none" title="reset" style="left: -26px; padding: 0px 4px; height: 26px; top: 3px; border: solid 0.5px #c5c5c5;"><i class="fas fa-redo h7_5 position-relative" style="top: -2px;"></i></input>`)
        const $btn = $(
            `<i class="fas fa-redo position-relative d-none py-1 pe-2" style="top: 7px; background: white; left: -25px; height: 15px;"></i>`
        ).on('click', function () {
            $input.val('');
            $btn.addClass('d-none');
            success(null);
        });

        const div = $('<div class="d-flex flex-row">').append($input).append($btn);

        onRendered(function () {
            //            $input.focus();
            //            $input.css('height', '100%');
        });

        return div[0];
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" editor: dateEditor: Used only @index.js for testing  ">
    //#region -editor: dateEditor : Used only @index.js for testing
    dateEditor = (cell, onRendered, success, cancel) => {
        const date = new Date(cell.getValue());
        const cellValue = DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');

        const input = $('<input>')
            .attr('type', 'date')
            .css({
                padding: '4px',
                width: '100%',
                boxSizing: 'border-box',
            })
            .val(cellValue)
            .on('change', function () {
                if ($(this).val() !== cellValue) {
                    success(DateTime.fromFormat($(this).val(), 'yyyy-MM-dd').toFormat('yyyy-MM-dd'));
                } else {
                    success(cell.getValue());
                }
            })
            .on('keydown', function (e) {
                handleKeyDown(
                    e,
                    () => {
                        if ($(this).val() !== cellValue) {
                            success(DateTime.fromFormat($(this).val(), 'yyyy-MM-dd').toFormat('yyyy-MM-dd'));
                        } else {
                            success(cell.getValue());
                        }
                    },
                    cancel
                );
            });

        onRendered(function () {
            input.focus();
            input.css('height', '100%');
        });

        return input[0];
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" iHandle_addNewRowBtn ">
    //#region -iHandle_addNewRowBtn
    iHandle_addNewRowBtn = (e, v1, v2) => {
        const id = Date.now().toString();
        let newRowData = { id, isCurrentRow: { new_row: true } };
        if (!shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_add_new_row_before, newRowData)) {
            return;
        }
        // enable edit mode for new row
        this.enableEditMode({ for_newRow: { data: newRowData } });

        this.AdditionalTabulatorInitOptions.iTr_add_new_row_after?.();
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" iHandle_duplicateRowBtn ">
    //#region -iHandle_duplicateRowBtn
    iHandle_duplicateRowBtn = () => {
        iConsole('--------- duplicateRowBtn');
        const id = Date.now().toString(); // we need a unique temporary id for this row

        let newRowData = { ...this.currentSelectedRows[0].getData(), id: id, isCurrentRow: { new_row: true } };
        if (!shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_row_duplicate_start, newRowData)) {
            return;
        }

        // enable edit mode for new row
        this.enableEditMode({ for_newRow: { data: newRowData } });

        this.AdditionalTabulatorInitOptions.iTr_row_duplicate_end?.();
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" enableEditMode ">
    //#region -enableEditMode
    enableEditMode = (options = {}) => {
        iConsole('------ edit mode  -------------');
        const settings = {
            ...options,
        };

        let row = this.currentSelectedRows[0];

        if (!shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_enableEditMode_start, { row: row })) {
            // add class is-invalid_bycode to bypass the regular check
            return;
        }

        if (settings.for_newRow) {
            this.TabulatorObj.addData(settings.for_newRow.data);

            // unselect the original row from which the new-row is generated
            this.rowDeselectSelectedRows();

            // get the new added row and freeze it
            const newRow = this.TabulatorObj.getRow(settings.for_newRow.data.id);
            // newRow.select();
            this.selectRowAndCheckInput(newRow);
            newRow.freeze();

            // update the currentSelectedRows
            row = newRow;
            this.currentSelectedRows = [newRow];
        }

        this.iTr_setEditMode({ setTo: true });
        // disable master selection
        this.toggleMasterCheckBox(this.currentSelectedRows.length > 0);
        // this.toggleMasterCheckBox(this.currentSelectedRows.length == 0 ? false : true);
        this.freezeCurrentEditingRow();

        // save current data for the row that user is editing for restoring it on discard
        if (!this.selecteRowStates.old_data) {
            iConsole({ mangager: this.selectedRowsSet.old_data }, this.selectedRowsSet.values());

            if (this.selectedRowsSet.size === 0) {
                alert(`Make sure that the table has an "id" field.\n\nThe code will have an error.`);
            }

            this.selecteRowStates.old_data = structuredClone(this.TabulatorObj.getRow([...this.selectedRowsSet.values()][0]).getData());
        }

        // workaround for enabling the free-form selection of the text for the table cells
        // user can focus on the cells using tab, when that row is being edited
        // this.currentSelectedRows[0].getCells().forEach((cell) => {
        //     $(cell.getElement()).removeAttr('tabindex');
        // });

        // (this.currentSelectedRows[0].getData().isCurrentRow ??= {}).edit_mode = true;
        (row.getData().isCurrentRow ??= {}).edit_mode = true;

        //        if (!shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_enableEditMode_end)) {
        //            return;
        //        }

        // reformatting to activate the cell/row formatter
        row.reformat();

        // if editing is enabled, then disable row-expand and row-select elements in the row element.
        if (this.isRowExpandColPresent) {
            $('button', row.getCell('rowExpand').getElement()).prop('disabled', this.isEditing);
        }
        if (this.isRowSelectionColPresent) {
            $('input', row.getCell('rowSelection').getElement()).prop('disabled', this.isEditing);
        }

        //        this.AdditionalTabulatorInitOptions.iTr_enableEditMode_end?.();
        this.AdditionalTabulatorInitOptions.iTr_enableEditMode_end?.(row);
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" trackRowsSelection ">
    //#region -trackRowsSelection
    trackRowsSelection(data, rows) {
        // let disabledCount = this.TabulatorObj.getData().filter(function(obj) {
        //     return obj.is_disabled === true;
        // }).length;
        // let rows_enabled = this.TabulatorObj.getData().length - disabledCount;

        // un-check all of the old rows
        this.currentSelectedRows.forEach((row) => {
            if (!row) {
                return;
            }
            // unfreeze only if row is frozen.
            if (row.isFrozen()) {
                row.unfreeze();
            }
            const input = $('input', row.getCell('rowSelection').getElement());
            input?.prop('checked', false);
        });

        // check the selected rows
        rows.forEach((row) => {
            const input = $('input', row.getCell('rowSelection').getElement());
            input.prop('checked', true);
        });

        // check the selected rows
        this.currentSelectedRows = rows; // +Future+  are we not using much more memory that way? why not to keep the ids in other words can we not use selectedRowsSet to do the work
        const totalSelectedRows = data.length;

        if (totalSelectedRows == 0) {
            this.AdditionalTabulatorInitOptions.iTr_on_row_selection_zero?.();

            // allow to select only one rows.
            // enable all rows again, when the selected row is deselected.
            if (this.AdditionalTabulatorInitOptions.iTr_multi_row_select_disable) {
                this.toggleAllRowsChkBox(false);
            }
        }
        if (totalSelectedRows == 1) {
            this.AdditionalTabulatorInitOptions.iTr_on_row_selection_one?.();

            // allow to select only one rows.
            // when one row is selected, then disable all other row selection.
            if (this.AdditionalTabulatorInitOptions.iTr_multi_row_select_disable) {
                this.toggleAllRowsChkBox(true);
                $('input', this.currentSelectedRows[0].getCell('rowSelection').getElement()).prop('disabled', false);
            }
        }
        if (totalSelectedRows > 1) {
            this.AdditionalTabulatorInitOptions.iTr_on_row_selection_multiple?.();
        }

        // this.toggleTbl_multy_purps_w(false)

        // updating the master-row-selection-header input check status, when checking-unchecking table rows
        if (totalSelectedRows >= 1 && totalSelectedRows == this.currentPageData.length) {
            $(`.master-row-selection-header`, $(this.TabulatorObj.element.closest('.table-container'))[0]).prop({
                checked: 1,
                indeterminate: 0,
            });
        } else if (totalSelectedRows >= 1) {
            $(`.master-row-selection-header`, $(this.TabulatorObj.element.closest('.table-container'))[0]).prop({
                checked: 0,
                indeterminate: 1,
            });
        } else {
            $(`.master-row-selection-header`, $(this.TabulatorObj.element.closest('.table-container'))[0]).prop({
                checked: 0,
                indeterminate: 0,
            });
        }

        if (totalSelectedRows > 1) {
            this.toggleTbl_multi_select_w(true);
        } else {
            this.toggleTbl_multi_select_w(false);
            this.toggleTbl_read_mode_w(true);
        }

        // hide row operations
        if (totalSelectedRows == 0 || totalSelectedRows > 1) {
            this.toggleSingleRowOperationsContainer(false);
            this.toggleDuplicateRowBtn(false);
        }
        // show row operations
        if (totalSelectedRows == 1) {
            this.toggleSingleRowOperationsContainer(true);
            this.toggleDuplicateRowBtn(true);
            this.toggleTbl_read_mode_w(false);

            // rows[0].getCells().forEach((cell, idx)=>{
            //     if(idx <=1) return
            //     const col = cell.getColumn()
            //     this.TabulatorObj.updateColumnDefinition(col, {editor: "input"})
            // })
        }
        // show row operations for multiple-row
        // if (totalSelectedRows > 1) {
        //     this.toggleTbl_multy_purps_w(true)
        // }
    }
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" iHandle_deleteRow ">
    //#region -iHandle_deleteRow
    iHandle_deleteRow = () => {
        const deleteRecord = this.TabulatorObj.getSelectedData()[0];
        if (!shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_row_delete_before, this, deleteRecord)) {
            return;
        }

        this.AdditionalTabulatorInitOptions.iTr_row_delete_after?.({ delete: deleteRecord });
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" handleUpdateEditedRow ">
    //#region -handleUpdateEditedRow
    handleUpdateEditedRow = () => {
        iConsole('--- handleUpdateEditedRow---');
        // getting the updated records from Tabulator
        const updatedRecords = this.TabulatorObj.getSelectedData();
        let row = this.TabulatorObj.getSelectedRows()[0];

        //        if (!shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_row_save_before, this, updatedRecords[0], row)) {
        if (
            !shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_row_save_before, {
                FtrdTblObj: this,
                row: row,
                rowData: updatedRecords[0],
            })
        ) {
            // add class is-invalid_bycode to bypass the regular check
            return;
        }

        updatedRecords
            ?.filter((data) => data?.isUpdated)
            .map((data) => {
                delete data.isUpdated;
                delete data.is_row_selected;
                return data;
            });

        //        if (updatedRecords.length == 0) {
        //            alert('Nothing to update.');
        //            return;
        //        }

        // Verify that all required fields have a value; you may bypass this check in case the input element has a class .is-invalid_bycode
        let cells = row.getCells();
        $.each(cells, (inx, cell) => {
            let $cell = cell.getElement();
            let cell_def = cell.getColumn().getDefinition();
            let cell_val = cell.getRow().getData()[cell_def.field];
            // console.log(cell.getField(), " visible? ", cell.getColumn().isVisible());
            if (!$(':input', $cell).hasClass('is-invalid_bycode')) {
                $(':input', $cell).removeClass('is-invalid');
                if (
                    cell_def.validator === 'required' &&
                    cell.getColumn().isVisible() &&
                    (cell_val === undefined || cell_val === null || cell_val === '')
                ) {
                    $(':input', $cell).addClass('is-invalid');
                }
            }
        });

        let $row = row.getElement();
        $(':input.is-invalid:first', $row).focus();
        if ($(':input.is-invalid', $row).length !== 0) {
            return;
        }

        this.AdditionalTabulatorInitOptions.iTr_row_save_after?.({ FtrdTblObj: this, updates: updatedRecords, row: row });
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" updateRowStatus ">
    //#region -updateRowStatus
    updateRowStatus = (sets = {}) => {
        // for a new row we need to update the rec ID received from the D.B.
        // Therefor we call it with {nrecID: {"id": json["nRid"]}
        // the "id" is the column's field name
        const row = this.TabulatorObj.getRow(this.TabulatorObj.getSelectedData()[0].id);
        let row_data = row.getData();
        let isNewRec = row_data.isCurrentRow?.new_row;

        if (isNewRec && !$.isEmptyObject(sets)) {
            let id_field_name = Object.keys(sets.nrecID)[0];
            row_data[id_field_name] = sets.nrecID[id_field_name];
        }

        delete row_data.isCurrentRow;
        delete row_data.__inputVal;
        row?.reformat(); // to go out the edit mode to make it visible mode

        this.iTr_setEditMode({ setTo: false, setMore: true, isNewRow: isNewRec });
        this.toggleUpdateEditedRowBtn(true);

        if (sets?.delete) {
            // if we asked to delete a row
            row.delete();
        }

        // reset horizontal-scroll for table-header
        $('.tabulator-header-contents', this.TabulatorObj.element)[0].scrollTo(0, 0);
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" COMMENT: __discardEditRowChanges ">
    //#region -COMMENT __discardEditRowChanges
    __discardEditRowChanges = () => {
        // restore old value
        this.currentSelectedRows.forEach((row) => {
            iConsole({ old_data: this.selecteRowStates.old_data });
            row.update(this.selecteRowStates.old_data);
            delete row.getData().isCurrentRow;
            row.reformat();

            /* old-logic
             row.getCells().forEach(c => {
                 if (c.isEdited()) {
                     c.restoreOldValue()
                 }
             })
            */
        });
        this.iTr_setEditMode({ setTo: false, setMore: true });

        this.editedRowData = null;
        this.selecteRowStates = { old_data: null };
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" discardEditRowChanges ">
    //#region -discardEditRowChanges
    discardEditRowChanges = () => {
        // reset horizontal-scroll for table-header
        $('.tabulator-header-contents', this.TabulatorObj.element)[0].scrollTo(0, 0);

        // restore old value
        let isNewRec = false;
        let row = this.currentSelectedRows[0];
        let old_data = this.selecteRowStates.old_data;

        if (row) {
            // moved to here b/c on undo we need the row to be available before we ask to close all pop-ups/dropdown
            this.iTr_setEditMode({ setTo: false, setMore: true, isNewRow: !isNewRec });

            iConsole({ old_data: old_data });
            isNewRec = row.getData()?.isCurrentRow?.new_row;
            delete row.getData().isCurrentRow;

            if (isNewRec) {
                row.delete();
            } else {
                if (old_data) {
                    old_data.is_row_selected = false;
                }
                this.selectRowAndCheckInput(row, false, true);
                row.update(old_data);
                row.reformat();
            }
        }

        //        this.iTr_setEditMode({ setTo: false, setMore: true, isNewRow: !isNewRec });

        this.editedRowData = null;
        this.selecteRowStates = { old_data: null };

        this.AdditionalTabulatorInitOptions.iTr_row_discard_after?.(row);
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" discardEditRowChanges ">
    //#region -discardEditRowChanges
    rowDeselectSelectedRows = (delete_iTr_edit_row, isNewRow) => {
        // iConsole('goood', this.currentSelectedRows)
        // this.TabulatorObj.deselectRow();
        this.currentSelectedRows.forEach((row) => {
            // row.deselect();
            this.selectRowAndCheckInput(row, false, true);

            // adding fix here to deleting the edited-row
            // delete the row only when discarding the changes
            if (delete_iTr_edit_row && !(isNewRow ?? true)) {
                const id = row.getData()[this.TabulatorObj.options.index] ?? null;
                if (id == null) {
                    return;
                }
                this.selectedRowsSet.delete(id);

                const idArr = this.currentPageData.map((data) => data.id);
                // needed to delete the editing row when it's not present in the page-data which is loaded in the Tabulator
                // this would only run when filtering or sorting is done, or change pagination
                //                if (!idArr.includes(row.getData().id) && this.hasUserFiltered) {
                if (!idArr.includes(row.getData().id)) {
                    iConsole('---  deleting row with id  --->', row.getData().id);
                    this.TabulatorObj.deleteRow(row.getData().id);
                }
            }
        });
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" toggle diff els ">
    //#region -toggle diff els
    /**
     * Toggles the selection state.
     *
     * @param {boolean} [value] - Optional. If `true`, selects the item. If `false`, deselects it.
     *                            If no value is provided, the selection state is toggled.
     */
    rowToggleSelectionAllRows = (customVal) => {
        if (this.TabulatorObj.getColumn('rowSelection')?.getElement()) {
            const value = customVal ?? !$('input', this.TabulatorObj.getColumn('rowSelection')?.getElement()).prop('checked');
            $('input', this.TabulatorObj.getColumn('rowSelection')?.getElement()).prop('checked', value).change();
        }
    };
    rowToggleSelectionByRow = (rows, customVal) => {
        /**
         * Updates the selection state for a list of rows.
         *
         * @param {Array} rows - Required. An array of row objects to process.
         * @param {boolean} [customVal] - Optional.
         *                                If `true`, selects all rows.
         *                                If `false`, deselects all rows.
         *                                If omitted, toggles the selection state of each row.
         */
        rows.forEach((row) => {
            const row_data = row.getData();
            let value = customVal ?? !row_data.is_row_selected;
            row_data.is_row_selected = value;
            if (row.getCell('rowSelection')?.getElement()) {
                $('input', row?.getElement()).prop('checked', value).change();
            }
        });
    };

    toggleMasterCheckBox(shouldDisable) {
        if (this.isRowSelectionColPresent) {
            $(this.TabulatorObj.getColumn('rowSelection').getElement()).find('input').prop('disabled', shouldDisable);
        }
    }

    toggleSingleRowOperationsContainer(shouldShow) {
        if (shouldShow) {
            $(this.rowOperationsContainer).addClass('d-flex').removeClass('d-none');
        } else {
            $(this.rowOperationsContainer).addClass('d-none').removeClass('d-flex');
        }
    }

    toggleEditVisualizer(shouldAdd) {
        if (this.currentSelectedRows.length > 1 || this.currentSelectedRows.length == 0) return;
        const row = this.currentSelectedRows[0];
        if (!row) return;
        if (shouldAdd) {
            $(row.getElement()).addClass('edit-row-visulizer');
        } else {
            $(row.getElement()).removeClass('edit-row-visulizer');
        }
    }

    toggleEnableEditModeBtn(shouldDisable) {
        $(this.enableEditRowBtn).prop('disabled', shouldDisable);
        if (shouldDisable) {
            $(this.enableEditRowBtn).removeClass('text-primary').addClass('text-secondary');
        } else {
            $(this.enableEditRowBtn).removeClass('text-secondary').addClass('text-primary');
        }
    }

    toggleDuplicateRowBtn(shouldView) {
        if (shouldView) {
            $(this.duplicateRowBtn).removeClass('text-secondary').addClass('text-warning').prop('disabled', !shouldView);
        } else {
            $(this.duplicateRowBtn).removeClass('text-warning').addClass('text-secondary').prop('disabled', !shouldView);
        }
    }
    toggleDeleteRowBtn(shouldView) {
        if (shouldView) {
            $(this.deleteRowBtn).removeClass('text-secondary').addClass('text-danger border-danger').prop('disabled', !shouldView);
        } else {
            $(this.deleteRowBtn).removeClass('text-danger border-danger').addClass('text-secondary').prop('disabled', !shouldView);
        }
    }

    toggleUpdateEditedRowBtn(shouldDisable) {
        $(this.updateEditedRowBtn).prop('disabled', shouldDisable);
    }

    toggleRowOperationsBtn(shouldDisable) {
        $(this.discardEditedRowBtn).prop('disabled', shouldDisable);

        if (shouldDisable) {
            $(this.discardEditedRowBtn).removeClass('text-danger').addClass('text-secondary');
        } else {
            $(this.discardEditedRowBtn).removeClass('text-secondary').addClass('text-danger');
        }
    }

    toggleAllRowsChkBox(shouldDisable) {
        this.TabulatorObj.getRows().forEach((row, idx) => {
            setTimeout(() => {
                if (this.isRowExpandColPresent && row.getCell('rowExpand')) {
                    // we need to have a row data exist ..
                    $('button', row.getCell('rowExpand').getElement()).prop('disabled', shouldDisable);
                }
                if (this.isRowSelectionColPresent && row.getCell('rowSelection')) {
                    // we need to have a row data exist ..
                    $('input', row.getCell('rowSelection')?.getElement()).prop('disabled', shouldDisable);
                }
            });
        });
    }

    // Function for - select all of the rows if master select is checked.
    //     toggleAllTblRowsToCheck = () =>{
    //         if(this.isRowSelectionColPresent){
    //             // select all of the rows if master select is checked.
    //             const isMasterSelected = $('input', this.TabulatorObj.getColumn("rowSelection").getElement()).prop('checked');
    //             if(isMasterSelected){
    // //                let ids_arr = get_row_ids_to_select(this);
    // //                this.TabulatorObj.selectRow(ids_arr);
    //                 selectRowsAndCheckInput(this);
    //                 // this.TabulatorObj.selectRow("all");
    //             }
    //         }
    //     }

    toggleTbl_read_mode_w(shouldShow) {
        if (shouldShow) {
            $('.tbl_read_mode_w', this.tableContainerElement).removeClass('d-none');
        } else {
            $('.tbl_read_mode_w', this.tableContainerElement).addClass('d-none');
        }
    }
    toggleTbl_multi_select_w(shouldShow) {
        if (shouldShow) {
            $('.tbl_multi_select_w', this.tableContainerElement).removeClass('d-none');
        } else {
            $('.tbl_multi_select_w', this.tableContainerElement).addClass('d-none');
        }
    }
    toggleTbl_multy_purps_w(shouldShow) {
        if (shouldShow) {
            $('.tbl_multy_purps_w .multi-purpose-btns', this.tableContainerElement).removeClass('d-none');
        } else {
            $('.tbl_multy_purps_w .multi-purpose-btns', this.tableContainerElement).addClass('d-none');
        }
    }
    //#endregion
    // </editor-fold>

    // row function
    // <editor-fold defaultstate="collapsed" desc=" freezeCurrentEditingRow ">
    //#region -freezeCurrentEditingRow
    freezeCurrentEditingRow = () => {
        const row = this.TabulatorObj.getRow([...this.selectedRowsSet.values()][0]);

        // do not freeze the row, if flag is false
        // allow freezing for new rows, but not for the exisiting rows which are edited.
        if (!this.AdditionalTabulatorInitOptions.iTr_enable_edit_row_freezing && !row.getData().isCurrentRow?.new_row) {
            return;
        }
        if (row && !row.isFrozen()) {
            row.freeze();
        }
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" updateCurrentPageDate ">
    //#region -updateCurrentPageDate
    updateCurrentPageDate = (newData) => {
        this.currentPageData = newData;

        // calculating the count of the disabled rows
        this.iTr_disabled_rows_count = newData.filter((data) => {
            return data.is_disabled === true;
        }).length;
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" getTableColumns ">
    //#region -getTableColumns
    // returns columns names in an array
    getTableColumns = () => {
        //        return this.AdditionalTabulatorInitOptions.columnsObj.call(this).reduce((acc, column) => {
        return this.iTr_columnsObj().reduce((acc, column) => {
            //                if (column.field == 'rowSelection') return acc;

            // ++Test++
            acc.push({
                ...column,
                hidden: !column.visible,
                hidden_by_user: this.TableSettings.persist_column_visibility['hiddenColumns'].includes(column.field),
            });
            // acc.push({ ...column, hidden: !column.visible, dinm_dd_toCcheck : column.visible});
            //            acc.push({ ...column, hidden: !column.visible});
            return acc;
        }, []);
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" moveRowSelectionOnKeyDown ">
    //#region -moveRowSelectionOnKeyDown
    moveRowSelectionOnKeyDown = (e) => {
        if (e.keyCode != 39 && e.keyCode != 37) {
            return;
        }
        if (this.isEditing) {
            return;
        }

        e.preventDefault();

        const rows_arr = [...this.selectedRowsSet];

        // don't run logic if row is more than 1 or is 0.
        if (rows_arr.length == 0) {
            return;
        }
        if (rows_arr.length > 1) {
            return;
        }

        const row = rows_arr[0];
        const currentSelectedRow = this.TabulatorObj.getRow(row);

        if (!currentSelectedRow) {
            iConsole('current selected row not found');
            return;
        }

        // select the previous and next row
        if (e.keyCode == 37) {
            const prevRow = currentSelectedRow.getPrevRow();
            if (!prevRow) {
                iConsole('previous row is not present');
                return;
            }
            if (prevRow) {
                try {
                    // currentSelectedRow.deselect();
                    this.selectRowAndCheckInput(currentSelectedRow, false, true);

                    // prevRow.select();
                    this.selectRowAndCheckInput(prevRow);

                    prevRow.scrollTo().then(() => {
                        this.focusToSelectedRowInput();
                    });
                } catch (err) {
                    iConsole(err);
                }
            }
        }
        if (e.keyCode == 39) {
            const nextRow = currentSelectedRow.getNextRow();
            if (!nextRow) {
                iConsole('next row is not present');
                return;
            }
            if (nextRow) {
                try {
                    // currentSelectedRow.deselect();
                    this.selectRowAndCheckInput(currentSelectedRow, false, true);

                    // nextRow.select();
                    this.selectRowAndCheckInput(nextRow);

                    nextRow.scrollTo().then(() => {
                        this.focusToSelectedRowInput();
                    });
                } catch (err) {
                    iConsole(err);
                }
            }
        }
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" focusToSelectedRowInput ">
    //#region -focusToSelectedRowInput
    focusToSelectedRowInput = () => {
        const rows_arr = [...this.selectedRowsSet];

        if (rows_arr.length == 0) {
            iConsole('next row is not present');
            return;
        }

        const row = this.TabulatorObj.getRow(rows_arr[0]);
        if (!row) {
            return;
        }
        if (this.isRowSelectionColPresent) {
            $('input', row.getCell('rowSelection').getElement()).focus();
        }
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" updateStatus ">
    //#region -updateStatus
    // ===
    // function updateStatus(){
    // if yes, replace all this format with function .....
    updateStatus = () => {
        const rowCount = this.TabulatorObj.getDataCount();
        const visibleRows = this.TabulatorObj.getRows('visible').filter((row) => row?._getSelf()?.type === 'row');
        const filteredRows = this.TabulatorObj.getRows('active');
        const visibleCount = visibleRows.length;
        const start = visibleCount > 0 ? visibleRows[0].getPosition() : 0;
        const end = visibleCount > 0 ? visibleRows[visibleCount - 1].getPosition() : 0;
        let $tbl_status = $('.table-status', this.TabulatorObj.element).last().empty();

        if (rowCount) {
            //            $('.table-status', this.TabulatorObj.element).last().html(visibleCount?
            //            $('.table-status', this.TabulatorObj.element).last().empty().append(visibleCount?
            $tbl_status.append(
                visibleCount
                    ? `<div>
                    <span class='fw-normal text-dark'>Showing <b>${start} to ${end} of ${
                          rowCount > filteredRows.length ? `${filteredRows.length.toLocaleString()} filtered rows` : ''
                      } (${rowCount.toLocaleString()} total)</b></span>
                </div>`
                    : `<div><span class='fw-normal text-dark'><b>${rowCount} total</b></span></div>`
            );
        } else {
            //            $('.table-status', this.TabulatorObj.element).last().empty().append(`<div style="height:10px;"><div>`);
            $tbl_status.append(`<div style="height:10px;"><div>`);
        }

        setTimeout(() => {
            $('.tabulator-tableholder', this.tableContainerElement).attr('style', this.h_tabulator_tableholder_height);
        }, 100);
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" cellF_rowExpand ">
    //#region -cellF_rowExpand
    //    cellF_rowExpand = (cell, formatterParams, onRendered, expandRowWithNestedTable_Fn, expanded_row) => {
    // to run function before / after we expand the the table, use
    // formatterParams.onRowCollapse / onRowExpand
    cellF_rowExpand = (cell, formatterParams, onRendered, expandRowWithNestedTable_Fn) => {
        let row = cell.getRow();
        let expanded_row = row;
        let returnVal = null;

        const button = $(
            `<button type="button" class="expand-btn btn btn-sm btn-success m-0 p-0"><i class="fas fa-plus px-1"></i></button>`
        ).click((e) => {
            console.log('on click: row expand');
            // delete all opended nested table, whenever new row is expanded only if iTr_expand_multi_rows is false.
            if (!this.AdditionalTabulatorInitOptions.iTr_expand_multi_rows && this.tbl_ExpandRows.length > 0) {
                this.tbl_ExpandRows.forEach((id) => {
                    const r = this.TabulatorObj.getRow(id);
                    if (r.getData().id != row.getData().id) {
                        // remove from the array
                        this.tbl_ExpandRows = this.tbl_ExpandRows.filter((id) => id !== r.getData().id);
                        // remove the class from the row element
                        $(r.getElement()).removeClass('row_expended');
                        // this will trigger the reformat for the row
                        r.reformat();
                    }
                });
            }

            const isExpanded = $(e.target).closest('button').data('expanded');

            if (isExpanded) {
                // tracking if any one row is expanded of the table
                this.tbl_ExpandRows = this.tbl_ExpandRows.filter((id) => id !== row.getData().id);
                deleteTableAndCollapseRow(e, row);

                $(row.getElement()).removeClass('row_expended mb-2');
                // getting the toolbar for the table and unhiding it when row is collapsed
                // show the toolbar
                if ($(row.getTable().element).hasClass('nested-table')) {
                    $($('.table-header-toolbar_w', $(row.getTable().element.closest('.table-container')))[0]).removeClass('d-none');
                    $($('.tabulator-header', $(row.getTable().element.closest('.table-container')))[0]).removeClass('hide-filter');
                }

                // scroll to the row where table is expanded
                if (expanded_row) {
                    expanded_row.getElement().scrollIntoView({ block: 'end' });
                }
                this.resizeNestedTable($(row.getTable().element));
                this.iTr_expTbl_resize_allExpTbls();
                if (formatterParams.onRowCollapse) {
                    formatterParams.onRowCollapse(e, row);
                }
            } else {
                expandRowWithNestedTable_Fn?.(e, row);
                $(row.getElement()).addClass('row_expended');

                // getting the toolbar for the table and hiding it when row is expanded
                // hide the toolbar
                if ($(row.getTable().element).hasClass('nested-table')) {
                    $($('.table-header-toolbar_w', $(row.getTable().element.closest('.table-container')))[0]).addClass('d-none');
                    $($('.tabulator-header', $(row.getTable().element.closest('.table-container')))[0]).addClass('hide-filter');
                }

                // tracking if any one row is expanded of the table
                this.tbl_ExpandRows.push(row.getData().id);
                if (formatterParams.onRowExpand) {
                    formatterParams.onRowExpand(e, row);
                }
            }

            let $rowSelectChbox = $(`[tabulator-field="rowSelection"] [type="checkbox"]`, $(e.target).closest('.tabulator-row'));
            if (!isExpanded && $rowSelectChbox.is(':enabled')) {
                $rowSelectChbox.prop('disabled', 1).addClass('restore_enable_after_collapse');
            } else if (isExpanded && $rowSelectChbox.hasClass('restore_enable_after_collapse')) {
                $rowSelectChbox.prop('disabled', 0).removeClass('restore_enable_after_collapse');
            }

            // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
            //#region -COMMENT
            /* const isExpanded = $(e.target).closest("button").data('expanded');
            
            if (isExpanded) {
                // tracking if any one row is expanded of the table
                this.isAnyRowExapanded = false
                deleteTableAndCollapseRow(e, row);
            } else {
                if(this.isAnyRowExapanded){
                    return;
                }
                expandRowWithNestedTable(e, row);
                // tracking if any one row is expanded of the table
                this.isAnyRowExapanded = true;
            }  */
            //#endregion
            // </editor-fold>
        });

        returnVal = $(button)[0];
        return returnVal;
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" package of: selecy_cell_FormatEditExport_manager ">
    //#region -selecy_cell_FormatEditExport_manager
    // <editor-fold defaultstate="collapsed" desc=" selecy_cell_FormatEditExport_manager ">
    //#region -selecy_cell_FormatEditExport_manager
    /* how to use it, add this to the column definition
        ...this.select_cell_FormatEditExport_manager({
            // used to map a new value for EXISTING el_class_by_val(= icons). so now if value = -1 we will get the iWifi icon
                map_el_class_by_val:{[-2]:'iWifi'},  or it can be {0:'iWifi', 1:'iWifiSlash'} which is like ['iWifi', 'iWifiSlash'] 
            // used to add a NEW icon (and its value) 
                iTr_select_cell_getEl_header_ops and or iTr_select_cell_getEl_formatter_ops : { itms{ [-1]: 'fas fa-check-double' }, }
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
                                                                
        ...this.select_cell_FormatEditExport_manager({
            map_el_class_by_val: {0:"iMinus", 1:1},     //  we re map the elements to the req. values
            iTr_get_icon_element_ops: {class: {0: "text-danger ", 1: "text-success text-primary", 300: "fas fa-yin-yang"},}, 
            exp_data_enums: {0: 'Stationary', 1:'PTZ', 300:"TEST"}
        }),
                                                                
        
        ** Here we set the header select's text                                                                                                                        
        ...this.select_cell_FormatEditExport_manager({ 
            map_el_class_by_val: {0:'iWifiSlash', 1:'iWifi'}, 
                iTr_select_cell_getEl_header_ops: { 
                    itms: {
                        none: { v: '', t: '-' }, // v is the elementvalue   if it is == "exclude-me" then we will exlude this option
                        opt1: { v: 0, t: 'Not live' },
                        opt2: { v: 1, t: 'Live' }    
                    }
                },                        
                exp_data_enums: {0: 'Not live', 1:'Live'}
            }),

        For SORT, use the tabulator sort with string or number and it will sort it correct
    */
    select_cell_FormatEditExport_manager = (ops = {}) => {
        const def = {
            map_el_class_by_val: undefined,
            iTr_get_icon_element_ops: undefined,
            iTr_select_cell_getEl_header_ops: undefined,
            iTr_select_cell_getEl_formatter_ops: undefined, // if not sent it will get the same value as iTr_select_cell_getEl_header_ops
            textOnly: 0,
            formatter: 1, // to allow a custom formatter
            exp_data_enums: undefined,
        };
        ops = $.extend(true, def, ops);

        ops.iTr_select_cell_getEl_formatter_ops = ops.iTr_select_cell_getEl_formatter_ops ?? ops.iTr_select_cell_getEl_header_ops;

        return {
            headerFilter: (cell, onRendered, success, cancel) => {
                let selectContainer = this.iTr_select_cell_getEl(cell, onRendered, ops.iTr_select_cell_getEl_header_ops);
                function onSuccess() {
                    success($(selectContainer).val());
                }
                $(selectContainer).on('change blur', onSuccess);

                return selectContainer[0];
            },
            formatter: ops.formatter
                ? (cell, formatterParams, onRendered) => {
                      let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

                      if (editMode) {
                          return this.iTr_select_cell_getEl(cell, onRendered, ops.iTr_select_cell_getEl_formatter_ops)[0];
                      } else {
                          if (ops.textOnly) {
                              return cell.getValue();
                          } else {
                              return this.iTr_get_icon_element(
                                  ops.map_el_class_by_val?.[cell.getValue()] ? ops.map_el_class_by_val[cell.getValue()] : cell.getValue(),
                                  {
                                      ...(ops.iTr_get_icon_element_ops || {}),
                                      class: ops.iTr_get_icon_element_ops?.class
                                          ? ops.iTr_get_icon_element_ops.class[cell.getValue()]
                                          : undefined,
                                  }
                              );
                          }
                      }
                  }
                : undefined,
            iTr_exp_attr: { exp_data_enums: ops.exp_data_enums },
        };
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" iTr_get_icon_element ">
    //#region -iTr_get_icon_element
    iTr_get_icon_element = (val, opts = {}) => {
        // It will return the cell format = the icon to show based on the cell value
        let defs = {
            el: $('<i>'),
            el_class_by_val: {
                0: 'fa fa-times text-danger',
                1: 'fa fa-check text-success',
                iWifi: 'fas fa-wifi text-success',
                iWifiSlash: 'fas fa-wifi-slash text-danger',
                iVideo: 'fa fa-video',
                iCassette: 'fal fa-cassette-tape',
                iMute: 'fas fa-volume-mute',
                'info-circle': 'far fa-info-circle',

                iMinus: 'fas fa-minus',
                iQuestion: 'fas fa-question',
                infinity: 'fas fa-infinity',
            },
            class: null,
            // center_class: "d-flex justify-content-center align-items-center pt-1"
        };
        let sets = $.extend(true, defs, opts);

        $(sets['el']).addClass(sets['el_class_by_val'][val]).toggleClass(sets.class);
        // $(sets['el']).addClass(sets['el_class_by_val'][val]).toggleClass(`${sets.class} ${sets.center_class}`);
        return $(sets['el']).prop('outerHTML');
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" iTr_cell_OnOff_insertEl ">
    //#region -iTr_cell_OnOff_insertEl
    iTr_select_cell_getEl = (cell, onRendered, opts = {}) => {
        /* Creating the <Select> element
         * for Header/Filter we return the element
         * for Cell we will add it to the cell and handling the onchange event
         * to set up a defult value and filter the data ontable created use:
            CustomTabulator.TabulatorObj.on('tableBuilt', () => {
                CustomTabulator.TabulatorObj.setHeaderFilterValue('filed name', 'value');        
            });
         */
        let defs = {
            TMPL_el: '#TMPL_chbox_select_element',
            TMPL_el_class: '',
            itms: {
                // none : {v: "", t: "-", r_v: null},  // v is the elementvalue,r_v is the value to return once selected
                none: { v: '', t: '-' }, // v is the elementvalue   if it is == "exclude-me" then we will exlude this option
                opt1: { v: 0, t: 'No' },
                opt2: { v: 1, t: 'Yes' },
            },
            cl_invalid: 'is-invalid',
            iBeforeChange: null,
        };
        let sets = $.extend(true, defs, opts);

        const $select = $('select', $(sets.TMPL_el).clone(true));
        $.each(sets['itms'], (kk, vv) => {
            if (vv['v'] === 'exclude-me') {
                return true;
            }

            let option = $(`<option [ data-el_for="${kk}" ]></option>`).val(vv['v']).text(vv['t']);
            $($select).append(option);
        });

        $($select).val(cell.getValue());

        if (cell.getType() === 'header') {
            $($select).toggleClass(sets['TMPL_el_class']).attr('title', $($select).find('option:selected').text());
            $($select).on('change', (e) => {
                $($select).attr('title', $(e.target).find('option:selected').text());
            });
            //            return $($select);
        } else {
            $($select).on('change', (e) => {
                /*
                // handling case when value is "-", if "-" then give null as value
//                const new_value = e.target.value === "" ? null : Number(e.target.value);
//                iConsole($(e.target).find('option:selected').data("el_for"));
                const new_value = e.target.value === "" ? null : Number(e.target.value);

                // updating the <isUpdated> flag and row data in Tabulator
                // We need this to get the updated values when we hit update-button and send the updated data
                cell.getTable().updateData([
                    { ...cell.getRow().getData(), [cell.getField()]: new_value, isUpdated: true },
                ]);*/
                // compare values if it changes then enable updateRowBtn for updating the row in db.
                this.toggleUpdateBtnOnChange(e, cell);

                if (!shouldRunAndProceed(sets.iBeforeChange, e, cell)) {
                    return;
                } else {
                    $(e.target).removeClass(sets['cl_invalid']);
                    if (e.target.value === sets['itms']['none']['v']) {
                        $(e.target).addClass(sets['cl_invalid']);
                        // return;
                    }
                    /*else {
                        // This is another way to do it BUT it reformats the row and if we have a class is-invalid we will lose it
                        // cell.getTable().updateData([
                        //     { ...cell.getRow().getData(), [cell.getField()]: Number(e.target.value), isUpdated: true }
                        // ]); 
                        cell.getData()[cell.getField()] = (Number(e.target.value) || e.target.value); // to make it work for number "123" => 123 or string "abc" => "abc"
                        cell.getData().isUpdated = true;  
                    }*/

                    cell.getData()[cell.getField()] = Number(e.target.value) || e.target.value; // to make it work for number "123" => 123 or string "abc" => "abc"
                    cell.getData().isUpdated = true;
                }
            });
            // $(cell.getElement()).empty().append($select);
        }
        return $($select);
    };
    //#endregion
    // </editor-fold>
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" HTML_cell_FormatSortExport_manager ">
    //#region -HTML_cell_FormatSortExport_manager
    HTML_cell_FormatSortExport_manager = (separators) => {
        const HtmlToString = (html) => {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = html || '';

            // Replace <br> with a comma and space
            return tempDiv.textContent
                .replace(/\s*,\s*/g, ', ')
                .replace(/\s+/g, ' ')
                .trim();
        };

        return {
            sorter: function (a, b, aRow, bRow, column) {
                return HtmlToString(a).localeCompare(HtmlToString(b));
            },
            formatter: function (cell, formatterParams, onRendered) {
                const cell_value = cell.getValue() || '';
                let $el_w = $('<div>');
                let $divs = null;

                if (separators.includes(',ToDiv')) {
                    const parts = cell_value.split(',');
                    $divs = parts.map((text) => $('<div>').text(text));
                }

                $el_w.append($divs);
                return $el_w[0];
            },
            iTr_exp_attr: {
                iTr_exp_col_handler: (colDef, rowData, idx, headers, row_data, colStyles, type) => {
                    let cellVal = rowData[colDef.field];
                    let output_val = HtmlToString(cellVal);
                    if (type === 'EXCEL') {
                        row_data[colDef.field] = output_val;
                    } else {
                        row_data.push(output_val);
                    }

                    if (idx === 0) {
                        // handling the header text, necessary to do it 1 time (idx=0)
                        headers.push({ title: colDef.title, field: colDef.field });
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
                },
            },
        };
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" iTr_cell_date_wrapper ">
    //#region -iTr_cell_date_wrapper
    iTr_cell_date_wrapper = (dateType = 'date', viewDateFormat) => {
        return {
            headerFilter: this.headerDateEditor,
            formatter: this.iTr_cell_date_editor_formatterEl,
            headerFilterParams: {
                type: dateType,
            },
            formatterParams: {
                type: dateType,
                viewDateFormat,
            },
            iTr_exp_attr: {
                iTr_exp_col_handler: (colDef, rowData, idx, headers, row_data, colStyles, type) => {
                    let cellVal = rowData?.[colDef.field]?.trim() || '';
                    // let ff = {
                    //     date: 'yyyy-MM-dd',
                    //     'datetime-local': 'yyyy-MM-dd HH:mm:ss',
                    // };
                    let ff = { date: 'dd-MM-yyyy', 'datetime-local': 'dd-MM-yyyy HH:mm:ss', time: 'HH:mm' };

                    if (dateType === 'time') {
                        if (/^\d{2}:\d{2}/.test(cellVal)) {
                            // Convert time-only to full ISO with dummy date
                            const today = DateTime.now().toISODate();
                            cellVal = `${today}T${cellVal}`;
                        } else if (/^\d{4}-\d{2}-\d{2}$/.test(cellVal)) {
                            // Full date with no time → add default time
                            cellVal = `${cellVal}T00:00:00`;
                        } else {
                            cellVal.includes('T') ? cellValue : cellVal.replace(' ', 'T');
                        }
                    }

                    let output_val = cellVal
                        ? DateTime.fromISO(cellVal.includes(' ') ? cellVal.replace(' ', 'T') : cellVal, { zone: 'utc' }).toFormat(
                              viewDateFormat || ff[dateType] || 'yyyy-MM-dd'
                          )
                        : '';
                    if (type === 'EXCEL') {
                        row_data[colDef.field] = output_val;
                    } else {
                        row_data.push(output_val);
                    }

                    if (idx === 0) {
                        // handling the header text, necessary to do it 1 time (idx=0)
                        headers.push({ title: colDef.title, field: colDef.field });
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
                },
            },
        };
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" iTr_set_cols_width ">
    //#region -iTr_set_cols_width
    iTr_set_cols_width = (w_minInPx, w_maxInPx = null, resSize = 1920) => {
        let cW = (w_minInPx / resSize) * screen.width;

        if (w_maxInPx && cW > w_maxInPx) {
            cW = w_maxInPx;
        }
        return cW;
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" iTr_cell_input_insertEl ">
    //#region -iTr_cell_input_insertEl
    iTr_cell_input_insertEl = (cell, formatterParams, onRendered) => {
        iConsole('cell formating, value: ' + cell.getValue());
        let cell_val = null;
        if (!shouldRunAndProceed(formatterParams.iBeforeCreateEl, cell)) {
            return;
        } else {
            cell_val = cell.getData().__inputVal ?? cell.getValue();
            delete cell.getData().__inputVal;
        }

        let $input = $(`<input class="form-control form-control-sm">`).val(cell_val);
        formatterParams.iEl_editMode?.($input, cell, ($updatedElement) => {
            $input = $updatedElement;
        });

        $input
            .on('focus', (e) => {
                if (!shouldRunAndProceed(formatterParams.iOnFocus, e, cell)) {
                    return;
                }
            })
            .on('input change', (e) => {
                console.log('--- input change');
                this.toggleUpdateBtnOnChange(e, cell);
                let cell_val = e.target.value;
                if (cell_val !== '') {
                    $(e.target).removeClass('is-invalid');
                }

                if (!shouldRunAndProceed(formatterParams.iOnChange, e, cell)) {
                    return;
                }

                // This is another way to do it BUT it reformats the row and if we have a class is-invalid we will lose it
                // cell.getTable().updateData([ { ...cell.getRow().getData(), [cell.getField()]: e.target.value, isUpdated: true } ]);
                cell.getData()[cell.getField()] = cell_val;
                cell.getData().isUpdated = true;
            })
            .on('blur', (e) => {
                console.log('--- blur');
                if (!shouldRunAndProceed(formatterParams.iOnBlur, e, cell)) {
                    return;
                }
            });

        return $input[0];
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" iTr_column_show_hide ">
    //#region -iTr_column_show_hide
    iTr_column_show_hide = (columnConfig) => {
        Object.entries(columnConfig).forEach(([column, visibility]) => {
            const tableInstance = this.tbl_ColumsToggleVisib_menu?.getTableInstance();
            if (visibility) {
                this.TabulatorObj.showColumn(column);
            } else {
                this.TabulatorObj.hideColumn(column);
            }
            if (tableInstance) {
                const row = this.tbl_ColumsToggleVisib_menu
                    .getTableInstance()
                    .getRows()
                    .find((item) => item.getData().field === column);
                if (visibility) {
                    tableInstance.selectRow(row.getIndex());
                } else {
                    tableInstance.deselectRow(row.getIndex());
                }
                this.tbl_ColumsToggleVisib_menu.options.fn_onDropdownClick(
                    row,
                    tableInstance?.getSelectedRows(),
                    tableInstance,
                    this.tbl_ColumsToggleVisib_menu.dropdown
                );
            }
        });
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" iTr_cell_editor_formatterEl ">
    //#region -iTr_cell_editor_formatterEl
    // used to render the cell editor by default when row is in edit mode
    iTr_cell_editor_formatterEl = (cell, formatterParams, onRendered) => {
        var column = cell.getColumn();

        // Get the column definition, including editor parameters
        var columnDefinition = column.getDefinition();
        // Access the editor parameters
        // var editorParams = columnDefinition.editorParams;
        let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;

        if (editMode && cell.getColumn().getDefinition().editable) {
            if (formatterParams?.iTr_dropdown) {
                return this.iTr_cell_dropdown_insertEl(cell, onRendered, columnDefinition, formatterParams);
            } else {
                return this.iTr_cell_input_insertEl(cell, formatterParams, onRendered);
            }
        } else {
            //            if(!shouldRunAndProceed(formatterParams.iEl_viewMode_v2, cell, {})) {
            //                return "FFFFF";
            //              }
            if (formatterParams.iEl_viewMode_runAndComplete) {
                return formatterParams.iEl_viewMode_runAndComplete?.(cell);
            }

            formatterParams.iEl_viewMode?.(cell);
            return cell.getValue();
            //            return $(cell.getElement()).prop("outerHTML");
        }
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" iTr_cell_dropdown_insertEl ">
    //#region -iTr_cell_dropdown_insertEl
    // --- this is a demo data object
    // [{"label": 'Basic color', value:'---'},
    // {"label":"Red","value":'Red', attribute:{name:'test', 'data-test': 'name'}},
    // {"label":"Green","value":'Green'}]
    // iTr_dropdown_ops - used for customizing dropdown
    iTr_cell_dropdown_insertEl = (cell, onRendered, columnDefinition, formatterParams) => {
        /*
         * dd list data: if text and value are the same, use value: null, and we will use the text as a value
         */

        formatterParams.iBeforeCreateEl?.(cell);

        if (!formatterParams?.iDropdown_getlist) {
            return $('<span>', {
                class: 'pe-2',
                html: 'no option found',
                click: (e) => {
                    e.stopPropagation();
                },
            }).get(0);
        }

        const id = cell.getData().isCurrentRow?.new_row
            ? `btn-new_data-${this.tableContainer.replace('.', '')}-${columnDefinition.field}`
            : `btn-${cell.getRow().getIndex()}-${columnDefinition.field}`;
        if (Tabulator.findTable(`#${id}`)) {
            Tabulator.findTable(`#${id}`).forEach((table) => table.destroy());
        }
        const el = $(`#${id}`);
        if (el.length) {
            el.empty(); // Clears inner content
        }
        $(`#${id}`).remove();

        const dropdown_ops = $.extend(
            true,
            {
                dd_el_w: { class: 'w-100' },
                dd_calling_btn: {
                    text: cell.getValue(),
                    class: 'dd_arrow_end text-start w-100 pe-4',
                    reseizable: true,
                    clearable: { doIT: false },
                    //                title: cell.getValue(),
                    width: columnDefinition.width - 15,
                    style: 'background-color:#fff; color:#212529; border:1px solid #ced4da;',
                }, // the element opened once we
                dd_select_list: { id },
                iTr_initTblOnStart: true, //It must be true in the case of DD, which can add data. It will help with clearing the data button
                iTr_data: { ajaxURL: null, class_name: null }, //  not clear if and when we use them class_name, style_name
                iTr_ddList: { type: formatterParams.iTr_dropdown_type },
                // we can call it with;  formatterParams : { label: 'dTxt', value:'dVal' }
                // This will be used for creating the dd tabulator if bother value and label the same, you may send only the value
                iTr_field_name: formatterParams.label,
                fn_onDropdownClick: (row, selectedRows, table, dropdown) => {
                    this.toggleUpdateBtnOnChange();
                    const filterBtnText = $(`.dropdownMenuButton`, dropdown);
                    let value_attr_name = formatterParams.value ?? formatterParams.label;
                    const value = row.getData()[value_attr_name];
                    filterBtnText.empty().append(value);
                    cell.getData()[cell.getField()] = value;
                    cell.getData().isUpdated = true;
                    $(`.dropdownMenuButton`, dropdown).removeClass('fw-bold');
                    // cell.setValue(listItem.label);

                    // cell is the calling cell of the dropdown from the table's row, row is the dd tabulator row
                    formatterParams.iDropdown_select_after?.(cell, row.getData(), row, dropdown);
                    // handleCheckboxChange(row, selectedRows, table, dropdown, filterIndex, dropdownId, type);
                },
                fn_addData: formatterParams.iTr_add_new_data
                    ? (value, selectedRows, table, dropdown) => {
                          this.toggleUpdateBtnOnChange();
                          const filterBtnText = $(`.dropdownMenuButton`, dropdown);
                          filterBtnText.empty().append(value);
                          cell.getData()[cell.getField()] = value;
                          cell.getData().isUpdated = true;
                          $(`.dropdownMenuButton`, dropdown).removeClass('fw-bold');

                          // cell is the calling cell of the dropdown from the table's row, row is the dd tabulator row
                          formatterParams.iDropdown_select_after_addNew?.(cell, cell.getData(), cell.getRow(), dropdown);
                      }
                    : undefined,
            },
            formatterParams.iTr_dropdown_ops || {}
        );
        if (!cell?.getValue()?.trim()) {
            dropdown_ops.dd_calling_btn.text = formatterParams?.iTr_dropdown_ops?.dd_calling_btn?.text || '-';
        } else {
            dropdown_ops.dd_calling_btn.text = cell.getValue();
        }
        const dropdown = createDropdownForTable(dropdown_ops, formatterParams.iDropdown_getlist(cell, onRendered, columnDefinition) || []);

        //return the editor element
        return dropdown.dropdown.get(0);
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" iTr_cell_date_editor_formatterEl ">
    //#region -iTr_cell_date_editor_formatterEl
    iTr_cell_date_editor_formatterEl = (cell, formatterParams, onRendered) => {
        formatterParams = { type: 'date', ...formatterParams };

        let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;
        let ww = { date: 108, 'datetime-local': 171 };
        // let ff = { date: 'yyyy-MM-dd', 'datetime-local': 'yyyy-MM-dd HH:mm:ss' };
        //        let ff = { date: 'dd-MM-yyyy', 'datetime-local': 'dd-MM-yyyy HH:mm:ss', time: 'hh:mm a' };
        let ff = { date: 'MM-dd-yyyy', 'datetime-local': 'MM-dd-yyyy HH:mm:ss', time: 'hh:mm a' };
        let inputFormat = { date: 'yyyy-MM-dd', 'datetime-local': "yyyy-MM-dd'T'HH:mm:ss", time: 'HH:mm' };

        if (editMode) {
            //            const date = new Date(cell.getValue());
            //            const cellValue = DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
            // const cellValue = DateTime.fromISO((cell.getValue() || '').replace(' ', 'T'), { zone: 'utc' }).toFormat(
            //     ff[formatterParams.type]
            // );
            let rawValue = (cell.getValue() || '').replace(' ', 'T');
            let dt;

            if (formatterParams.type === 'time') {
                dt = DateTime.fromFormat(rawValue, inputFormat.time);
            } else {
                dt = DateTime.fromISO(rawValue, { zone: 'utc' });
            }

            const cellInputValue = dt.isValid ? dt.toFormat(inputFormat[formatterParams.type]) : '';

            const input = $(
                `<input class="form-control form-control-sm" type="${formatterParams.type}" style="width: ${ww[formatterParams.type]}px;">`
            )
                .val(cellInputValue)
                .on('blur', (e) => {
                    // This is another way to do it BUT it reformats the row and if we have a class is-invalid we will lose it
                    // cell.getTable().updateData([
                    //     { ...cell.getRow().getData(), [cell.getField()]: DateTime.fromFormat($(this).val(), 'yyyy-MM-dd').toFormat('yyyy-MM-dd'), isUpdated: true },
                    // ]);
                    let rawValue = $(e.target).val();
                    let expectedInputFormat = inputFormat[formatterParams.type];

                    if (formatterParams.type === 'datetime-local') {
                        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(rawValue)) {
                            rawValue += ':00'; // Add missing seconds
                        } else if (rawValue.includes(' ') && !rawValue.includes('T')) {
                            expectedInputFormat = 'dd-MM-yyyy HH:mm:ss'; // Manual text input
                        }
                    }
                    const dt = DateTime.fromFormat(rawValue, expectedInputFormat);
                    const formattedValue = dt.toFormat(expectedInputFormat);
                    cell.getData()[cell.getField()] = formattedValue;
                    cell.getData().isUpdated = true;
                })
                .on('change', (e) => {
                    this.toggleUpdateBtnOnChange(e, cell);
                });

            return input[0];
        } else {
            //            return DateTime.fromJSDate(new Date(cell.getValue())).toFormat('MM/dd/yyyy');
            let cellValue = cell.getValue()?.trim() || '';
            let rawValue = cellValue;
            let format = inputFormat[formatterParams.type];

            // Try to detect if the format is different
            if (formatterParams.type === 'datetime-local') {
                if (rawValue.includes(' ') && !rawValue.includes('T')) {
                    // Looks like 'dd-MM-yyyy HH:mm:ss'
                    format = 'dd-MM-yyyy HH:mm:ss';
                } else if (rawValue.length === 10) {
                    // Looks like only date part (yyyy-MM-dd)
                    rawValue += 'T00:00:00';
                }
            }

            const parsed = DateTime.fromFormat(rawValue, format);

            if (formatterParams.iEl_viewMode_runAndComplete) {
                return formatterParams.iEl_viewMode_runAndComplete?.(cell);
            }

            formatterParams.iEl_viewMode?.(cell);

            const output = parsed.isValid ? parsed.toFormat(formatterParams.viewDateFormat ?? ff[formatterParams.type]) : 'Invalid Date';

            return output;
        }
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" iTr_zoom_or_edit ">
    //#region -iTr_zoom_or_edit
    iTr_zoom_or_edit(a, calledBy, event, cell) {
        let defaults = {
            popo_css: { 'min-width': '575px' },
            popo_title: 'Field data advanced edit mode',
            popo_z: { class: 'mb-0', style: 'background-color: #e7e7e9;' },
            popo_e: { class: 'mb-0', style: 'background-color: #e7e7e9;' },
            popo_offset: [0, -5],
            tarea_rows: 4,
            tarea_cc: 'w-100',
            tt_cusCl: 'tooltip-info',
            fun_onStrat: null, // do NOT change to -> function(){} as later we check if we have a function -> $.isFunction()
        };
        defaults = $.extend(true, defaults, a);

        let cell_el = cell.getElement();

        $('.tabulator-cell', cell.getTable().element).not('.edit-row-visulizer .tabulator-cell').tooltip('dispose').popover('dispose');

        // <editor-fold defaultstate="collapsed" desc=" on: td's dblclick ">
        if (calledBy === 'DblClick') {
            $(cell_el)
                .popover({
                    title: defaults['popo_title'],
                    content: 'TEMP-placeholder',
                    placement: 'auto',
                    html: true,
                    customClass: 'dt_input_focus',
                    offset: defaults['popo_offset'],
                })
                .popover('show');
            $(cell_el).on('shown.bs.popover', function () {
                let pover = $('.popover.dt_input_focus'); // = the custom class

                let btn_close = $(
                    '<button class="btn btn-sm btn-secondary border-dark border-w2 shadow px-4" \n\
                        type="button">Close</button>'
                ).click(function () {
                    let pover = $(this).closest('.popover');
                    let cal_el = $(`[aria-describedby="${$(pover).prop('id')}"]`);
                    $(cal_el).popover('dispose');
                });

                let btn_update = $(
                    '<button class="btn btn-sm btn-warning border-dark border-w2 shadow ms-4" \n\
                        type="button">Update field</button>'
                ).click(function () {
                    let pover = $(this).closest('.popover');
                    let $cell = cell.getElement();
                    $('input', $cell).val($('textarea', pover).val()).change();
                    $($cell).popover('dispose');
                });

                let data = null;
                let cc = null;
                let ss = null;
                let texta_class = null;
                let isDisabled = null;
                if ($(':input', $(cell_el)).length) {
                    cc = defaults['popo_e']['class'];
                    ss = defaults['popo_e']['style'];
                    data = $(':input', $(cell_el)).val();
                } else {
                    cc = defaults['popo_z']['class'];
                    ss = defaults['popo_z']['style'];
                    data = $(cell_el).text();
                    texta_class = 'text-dark bg-opacity-10';
                    isDisabled = 'disabled';
                }

                let pover_els = `
                    <div class="row"><div class="col">
                        <textarea class="${texta_class} ${defaults['tarea_cc']}" rows="${defaults['tarea_rows']}" ${isDisabled}></textarea>
                    </div></div>
                    <div class="row text-center mt-2"><div class="col col_btns"></div></div>`;
                $('.popover-body', pover).html(pover_els);

                $('.col_btns', pover).append(btn_close);
                if ($(':input', $(cell_el)).length) {
                    $('.col_btns', pover).append(btn_update);
                }

                $('.popover-body', pover).addClass(cc).attr('style', ss);
                $('.popover-body textarea', pover).val(data).focus();
                $(pover).css(defaults['popo_css']).addClass('shadow');
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc=" MouseEnter ">
        if (calledBy === 'MouseEnter') {
            //             iConsole(`MouseEnter ${$(cell_el)[0].scrollWidth} ${$(cell_el).innerWidth()}`);
            //             iConsole(`MouseEnter ${$(cell_el)[0].scrollWidth} ${$(cell_el).innerWidth()}`);

            if ($(cell_el).text() !== '') {
                if ($(cell_el)[0].scrollWidth - $(cell_el).innerWidth() > 1) {
                    let ttText = $(cell_el).text();
                    ttText = ttText.replaceAll(';', ';<br>');

                    try {
                        let jsonObject = $.parseJSON(ttText);
                        ttText = `<pre style="width:250px; margin: 0px 10px 10px -25px;">${JSON.stringify(jsonObject, null, 2)}</pre>`;

                        //                    $("body").append("<style type='text/css'>pre{ margin: 0px 10px 10px -25px !important; min-width: 200px;}</style>");
                        let style = 'pre{ margin: 0px 10px 10px -25px !important; min-width: 200px; }';
                        let styleExists = false;
                        $('style').each(function () {
                            var cssContent = $(this).html();

                            if (cssContent.includes(style)) {
                                styleExists = true;
                                return false; // Break the loop
                            }
                        });
                        if (!styleExists) {
                            $('body').append(`<style type="text/css">${style}</style>`);
                        }
                    } catch (err) {}

                    $(cell_el).tooltip({ title: ttText, customClass: defaults['tt_cusCl'], html: true, placement: 'left' }).tooltip('show');
                }
            }
        }
        // </editor-fold>
    }
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" cell_xv_onEdit_insert ">
    //#region -cell_xv_onEdit_insert
    // for inserting the select dropdown
    cell_xv_onEdit_insert = (cell, formatterParams, onRendered, opts = {}) => {
        opts = { TMPL_el: '#TMPL_select_element_dropdown', ...opts };
        const select = $(opts.TMPL_el).contents().clone(true);

        if (opts.options) {
            $.each(opts.options, (kk, vv) => {
                $(`option[data-el_for="${kk}"]`, select).val(vv['v']).text(vv['t']);
            });
        }

        if (opts.appendTo) {
            $(appendTo).append(select);
        }

        if (opts.onChange) {
            $(select).on('change', opts.onChange);
        }

        return select;
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" toggleVisibilityDropdownCheckbox ">
    //#region -toggleVisibilityDropdownCheckbox
    toggleVisibilityDropdownCheckbox = (parent, checkValue) => {
        $('input', parent)
            .prop('checked', checkValue)
            .trigger('change')
            .toArray()
            .forEach((input) => {
                if (checkValue) {
                    // show the column
                    this.TabulatorObj.showColumn($(input).prop('value'));
                } else {
                    // hide the columns
                    this.TabulatorObj.hideColumn($(input).prop('value'));
                }
            });
        if (this.TableSettings.persist_column_visibility.enabled) {
            if (checkValue) {
                // empty the hiddenColumns
                this.TableSettings.persist_column_visibility.hiddenColumns = [];
            } else {
                // empty the hiddenColumns and then push all the columns agains
                this.TableSettings.persist_column_visibility.hiddenColumns = [];
                $('input', parent)
                    .toArray()
                    .forEach((input) => {
                        this.TableSettings.persist_column_visibility.hiddenColumns.push($(input).prop('value'));
                    });
            }
        }

        Store.set(this.localStorageKey, this.TableSettings);
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" toggleUpdateBtnOnChange ">
    //#region -toggleUpdateBtnOnChange
    toggleUpdateBtnOnChange = (e, cell) => {
        // enable/disable update button when there is change in the cell value.
        let changed = false;
        let row = this.TabulatorObj.getSelectedRows()[0];
        let cells = row.getCells();
        $.each(cells, (inx, cell) => {
            let $cell = cell.getElement();

            // +?+ is it the correct way to do it?
            let isCellEditable =
                typeof cell.getColumn().getDefinition()?.editable === 'function'
                    ? cell.getColumn().getDefinition()?.editable?.(cell)
                    : cell.getColumn().getDefinition()?.editable;

            if ((isCellEditable || false) && this.selecteRowStates.old_data[cell.getField()] != $(':input', $cell).val()) {
                changed = true;
                return false;
            }
        });

        $(this.updateEditedRowBtn).prop('disabled', !changed);

        /*
         * ORIGNAL way but checking only the current cell, but what if we change a few cells the fact that one of them is back to its original value is not a reason not to allow to save the row
        if(this.selecteRowStates.old_data[cell.getField()] != $(e.target).prop("value")){
            $(this.updateEditedRowBtn).prop('disabled', false);
        }else{
            $(this.updateEditedRowBtn).prop('disabled', true);
        }
        */
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" iTr_row_selection_header_tbl_cell_formatter ">
    //#region -iTr_row_selection_header_tbl_cell_formatter
    iTr_row_selection_header_tbl_cell_formatter = () => {
        const checkbox = $(`<input type='checkbox' class='master-row-selection-header'/>`);

        // if disable multi row select flag is true then disable master select.
        if (this.AdditionalTabulatorInitOptions.iTr_multi_row_select_disable) {
            $(checkbox).prop('disabled', true);
        }

        $(checkbox).on('change', (e) => {
            let rows = [];

            if (this.filtered_tbl_data.length > 0) {
                rows = this.filtered_tbl_data;
            } else {
                rows = this.TabulatorObj.getRows();
            }
            if ($(e.target).prop('checked')) {
                // needed to fully check the master select,if user tries to check it when item is filtered
                // setTimeout(()=>{
                //     $(checkbox).prop({"checked": 1, "indeterminate": 0});
                // });

                this.TabulatorObj.getRows('visible').forEach((row) => {
                    this.selectRowAndCheckInput(row);
                });

                rows.forEach((row) => {
                    // moving away from this for master-select, using below code
                    // it has extra function calling into it, which is not needed to run when doing master-select.
                    // this.selectRowAndCheckInput(row,false);

                    // replacement of above logic
                    const row_data = row.getData();
                    const id = row_data[this.TabulatorObj.options.index] ?? null;

                    if (row_data.is_disabled) return;
                    row_data.is_row_selected = true;
                    // adding the row
                    if (!this.selectedRowsSet.has(id)) {
                        this.currentSelectedRows.push(row);
                        this.selectedRowsSet.add(id);
                    }
                });

                setTimeout(() => {
                    this.onRowSelectDeselect();
                });

                /* 
                // selectRowsAndCheckInput(this);
                if(this.filtered_tbl_data.length > 0){
                    this.filtered_tbl_data.forEach((row)=>{
                        row.select();
                    });
                } else {
                    this.TabulatorObj.selectRow();
//                    let ids_arr = get_row_ids_to_select(this);
//                    this.TabulatorObj.selectRow(ids_arr);
                }
                */
            } else {
                this.TabulatorObj.getRows('visible').forEach((row) => {
                    this.selectRowAndCheckInput(row, false, true);
                });
                rows.forEach((row) => {
                    // not using below, because we are running filtering logic inside deselect for currentSelectedRows.
                    // this.selectRowAndCheckInput(row,false,true);

                    if (row.getData().is_disabled) return;
                    row.getData().is_row_selected = false;

                    // do not need to uncheck un-visible row inputs.
                    // if(this.isRowSelectionColPresent){
                    //     const input = $('input', row.getCell('rowSelection').getElement());
                    //     input?.prop('checked', false);
                    // }
                });
                this.selectedRowsSet.clear();
                this.currentSelectedRows = [];
                setTimeout(() => {
                    this.onRowSelectDeselect();
                });

                /* 
                    $(checkbox).prop({"checked": 0, "indeterminate": 0});
                    if(this.filtered_tbl_data.length > 0){
                        this.filtered_tbl_data.forEach((row)=>{
                            row.deselect();
                        });
                    }else{
                        this.TabulatorObj.deselectRow();
                    }
                */
            }
        });
        $(checkbox).on('click', (e) => {
            e.stopPropagation();
            //            this.TabulatorObj.dispatchEvent('headerClick',null, this.TabulatorObj.getColumn('rowSelection'));
        });
        return checkbox[0];
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" iTr_row_selection_tbl_cell_formatter ">
    //#region -iTr_row_selection_tbl_cell_formatter
    iTr_row_selection_tbl_cell_formatter = (cell) => {
        // Create a checkbox
        //  add is_row_selected = true to the row's data in case you wish to select the row once you create it.
        const checkbox = $("<input type='checkbox' />");

        $(checkbox).on('change', (e) => {
            if ($(e.target).prop('checked')) {
                // this.TabulatorObj.selectRow(cell.getRow());
                this.selectRowAndCheckInput(cell.getRow());
            } else {
                // this.TabulatorObj.deselectRow(cell.getRow());
                this.selectRowAndCheckInput(cell.getRow(), false, true);
            }
        });
        return checkbox[0];
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" fn: selectRowAndCheckInput ">
    //#region - fn: selectRowAndCheckInput
    // we will always need this function to select/deselect any rows,
    // shouldTblRowSelect -> true, then it will check the row input element and trigger row.select() things, which is heavy, so pass it false for non-visible rows only.
    // for selecting visible rows call it like = > selectRowAndCheckInput(row)
    // for selecting non-visible rows call it like = > selectRowAndCheckInput(row,false)
    // for selecting visible rows call it like = > selectRowAndCheckInput(row)
    // for deselecting call it like = > selectRowAndCheckInput(row, false, true)
    selectRowAndCheckInput = (row, shouldTblRowSelect = true, deselect) => {
        if (row?._getSelf()?.type !== 'row') {
            // to prevent issues with group rows
            return;
        }
        const row_data = row.getData();
        const id = row_data[this.TabulatorObj.options.index] ?? null;

        // do not select the row, if its disabled
        if (row_data.is_disabled) return;

        if (deselect) {
            row.deselect();
            row_data.is_row_selected = false;

            if (this.isRowSelectionColPresent) {
                const input = $('input', row.getCell('rowSelection').getElement());
                input?.prop('checked', false);
            }

            // un-freeze the editing row
            this.currentSelectedRows.forEach((row) => {
                if (!row) {
                    return;
                }
                // unfreeze only if row is frozen.
                if (row.isFrozen()) {
                    row.unfreeze();
                }
            });

            // removing the row
            this.currentSelectedRows = this.currentSelectedRows.filter((c_row) => {
                return c_row.getElement() != row.getElement();
            });
            this.selectedRowsSet.delete(id);
        } else {
            if (shouldTblRowSelect) {
                row.select();

                if (this.isRowSelectionColPresent) {
                    // If shouldTblRowSelect comes true, then only check the input, means that the row is visible on the screen and then check its input.
                    // Because getting the input is costly, so not checking input of the un-visible rows.
                    const input = $('input', row.getCell('rowSelection').getElement());
                    input?.prop('checked', true);
                }
            }
            row_data.is_row_selected = true;

            // adding the row
            if (!this.selectedRowsSet.has(id)) {
                this.currentSelectedRows.push(row);
                this.selectedRowsSet.add(id);
            }
        }
        this.onRowSelectDeselect();
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" fn: onRowSelectDeselect ">
    //#region - fn, onRowSelectDeselect
    // function for updating the master-select check status and toggling the action buttons according the number of rows are selected/deselect.
    // used in when doing row select/deselect, master select/deselect, after filtering.
    onRowSelectDeselect = () => {
        const tbl_all_data = this.filtered_tbl_data.length > 0 ? this.filtered_tbl_data : this.currentPageData;
        const disabledCount = this.iTr_disabled_rows_count;

        const total_enabled_rows_length = tbl_all_data.length - disabledCount;
        // 1. this.currentSelectedRows.length == table.getData().length, then master-checkbox-1
        // 2. if this.currentSelectedRows.length < table.getData().length, them master-checkbox-0.5
        //3 else master-checkbox = 0
        // update the master checkbox
        const master_checkbox = $(`.master-row-selection-header`, $(this.TabulatorObj.element.closest('.table-container'))[0]);
        if (
            this.currentSelectedRows.length == 0 ||
            (this.TabulatorObj.getHeaderFilters().length > 0 && this.filtered_tbl_data.length == 0)
        ) {
            master_checkbox.prop({ checked: 0, indeterminate: 0 });
        } else {
            // master-checkbox states--------------------------------------------------------
            if (this.filtered_tbl_data.length > 0) {
                const filter_row_selected_count = this.filtered_tbl_data.filter((row) => row.getData().is_row_selected).length;
                // console.log(filter_row_selected_count, total_enabled_rows_length)

                if (filter_row_selected_count == total_enabled_rows_length) {
                    master_checkbox.prop({ checked: 1, indeterminate: 0 });
                } else if (filter_row_selected_count > 0 && filter_row_selected_count < total_enabled_rows_length) {
                    master_checkbox.prop({ checked: 0, indeterminate: 1 });
                } else {
                    master_checkbox.prop({ checked: 0, indeterminate: 0 });
                }
            } else {
                // console.log(this.currentSelectedRows.length, total_enabled_rows_length);

                if (this.currentSelectedRows.length == total_enabled_rows_length) {
                    master_checkbox.prop({ checked: 1, indeterminate: 0 });
                } else if (this.currentSelectedRows.length > 0 && this.currentSelectedRows.length < total_enabled_rows_length) {
                    master_checkbox.prop({ checked: 0, indeterminate: 1 });
                } else {
                    master_checkbox.prop({ checked: 0, indeterminate: 0 });
                }
            }
            // master-checkbox states--------------------------------------------------------end
        }

        // trigger routine according the selected rows length------------------------------------------------
        if (this.currentSelectedRows.length == 0) {
            this.AdditionalTabulatorInitOptions.iTr_on_row_selection_zero?.();

            // allow to select only one rows.
            // enable all rows again, when the selected row is deselected.
            if (this.AdditionalTabulatorInitOptions.iTr_multi_row_select_disable) {
                this.toggleAllRowsChkBox(false);
            }
        }
        if (this.currentSelectedRows.length == 1) {
            this.AdditionalTabulatorInitOptions.iTr_on_row_selection_one?.();

            // allow to select only one rows.
            // when one row is selected, then disable all other row selection.
            if (this.AdditionalTabulatorInitOptions.iTr_multi_row_select_disable) {
                // this.toggleAllRowsChkBox(true);
                this.TabulatorObj.getRows('visible')
                    .filter((row) => row?._getSelf()?.type === 'row')
                    .forEach((row) => {
                        if (row == this.currentSelectedRows[0]) {
                            return;
                        }
                        if (this.isRowExpandColPresent) {
                            $('button', row.getCell('rowExpand').getElement()).prop('disabled', true);
                        }
                        if (this.isRowSelectionColPresent) {
                            $('input', row.getCell('rowSelection').getElement()).prop('disabled', true);
                        }
                    });
                // if(this.isRowSelectionColPresent){
                //     // $('input', row.getCell('rowSelection').getElement()).prop('disabled', shouldDisable);
                //     $('input', this.currentSelectedRows[0].getCell("rowSelection").getElement()).prop("disabled",false)
                // }
            }
        }
        if (this.currentSelectedRows.length > 1) {
            this.toggleSingleRowOperationsContainer(false);
            this.toggleTbl_read_mode_w(false);

            this.AdditionalTabulatorInitOptions.iTr_on_row_selection_multiple?.();
        }
        // trigger routine according the selected rows length------------------------------------------------end

        // toggle actions btns according to selected rows length ---------------------------------------
        // hide row operations
        //        if (this.currentSelectedRows.length == 0 || this.currentSelectedRows.length > 1) {
        if (this.currentSelectedRows.length == 0) {
            this.toggleSingleRowOperationsContainer(false);
            //            this.toggleDuplicateRowBtn(false);
            this.toggleTbl_read_mode_w(true);
        }
        // show row operations
        if (this.currentSelectedRows.length == 1) {
            this.toggleSingleRowOperationsContainer(true);
            if (!this.isEditing) {
                this.toggleDuplicateRowBtn(true);
            }
            this.toggleTbl_read_mode_w(false);
        }
        if (this.currentSelectedRows.length > 1) {
            this.toggleTbl_multi_select_w(true);
        } else {
            this.toggleTbl_multi_select_w(false);
            // this.toggleTbl_read_mode_w(true);
        }
        // toggle actions btns according to selected rows length ---------------------------------------end
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" EXPORT ">
    //#region - EXPORT
    // <editor-fold defaultstate="collapsed" desc=" export functions ">
    //#region - export functions
    exportsFns = {
        // <editor-fold defaultstate="collapsed" desc=" List of defaults ">
        //#region - List of defaults

        // This code will be executed in the fn: getTableHeadersAndRows via the below exportsObj = {

        /* How to use it
           - For per column option we have
                iTr_exp_attr: {
                    PDF: { style: { cellWidth: 40, fillColor: 'red', textColor: 255 }, },
                    EXCEL: {
                            style: {
                                sh_header_row: { alignment: { horizontal: 'center', }, },
                                ws_cells: { alignment: { horizontal: 'left' }, }
                                wch: 50,    // <- will set the max cell with (so that the auto resize will not create a too wide cell
                            },
                    },

                    OR use a predefined style
                    EXCEL: { style: "h-left_cs_right" }


                    exp_data_enums: {0: "No", 1: "Yes",}   or  exp_data_enums: {"y": "active", "n": "inactive",} based on the underline data                     
                    number_as_string: 1, // incase we want number to be as a number do NOT include this attribute
                    iTr_exp_col_handler: (colDef, rowData, idx, headers, row_data, colStyles, type) => {
                        // use this to manipulate the output of a field in PDF / Excel 
                        it must take care of the header as well
                    },
                },


            - in the tablator leavel 
                exports: {
                    types: ['PDF', 'Excel', 'Print'],
                    isOEM : 0,
                    do_not_export_fields : ["rowSelection", "rowExpand", "__dummy__", "__dummy_front__"],
                    field_rowSelection: {title:"Is selected?", text_y:"Yes", text_n: null},                    
                    pdf: { fileName: 'testPDF', orientation: 'landscape', do_not_export_fields: ["rowSelection"], customRow: {position: [afterHeader | bottom], value:[[{data:'', style:{}}]]}},
                    excel: { fileName: 'testExcel', whorkSheetName:'sheetName', do_not_export_fields: ["rowExpand"], customRow: {position: [top | afterHeader | bottom], value:[[{data:'', style:{}}]]}},
                    print:{ fileName: 'testPrint',}, // this option is comment for now. there is a title build in coming from the browser tab name 
                    
                    *** excel style{font: { bold: true, color: { rgb: '000000' }, // Optional: Black text },} see at 
                    *** pdf style{font: { bold: true, color: { rgb: '000000' }, // Optional: Black text },}  see at https://github.com/simonbengtsson/jsPDF-AutoTable search: StyleDef
                                                                    
                }

            - iTrExp_addmore_fn
                    For adding or splitting a column of data and exporting it to Excel/PDF
                    have the following attribute in the row data, iTrExp_addmore_fn
                    The iTrExp_addmore_fn should have this format
                    {field.name:{"d","data to show", "h":"column's header name"}}
                    this can be created using the cell. formatter or directly from PHP

            - to Excluse a column from export to Excel and/or PDF
                add: exp_excel:1 and/or exp_pdf:1 to iExcludeFromList
         */

        export_def: () => {
            const headerFilename = this.exports?.print?.fileName || this.exportsFns.get_header_filename() || '';
            const temp_OEM = this.exports.isOEM ?? __isOEM__;

            return $.extend(
                true,
                {
                    do_not_export_fields: this.exports.do_not_export_fields || ['rowExpand', '__dummy__', '__dummy_front__'],
                    field_rowSelection: { title: 'Selected?', text_y: 'Yes', text_n: null },
                    isOEM: temp_OEM,
                    pdf: {
                        customRow: {
                            position: 'afterHeader',
                            value: [],
                        },
                        fileName: '',
                        fileNameSeperator: ' ', // we use it to automate the name from the page breadcrumb
                        orientation: 'landscape',
                        startY: 14,
                        //                    header_fillColor: '#0d6efd',
                        header_fillColor: '#1a273a',
                        header_textColor: 'white',
                    },
                    excel: {
                        customRow: {
                            position: 'top',
                            value: [],
                        },
                        fileName: '',
                        whorkSheetName: '',
                        headerTextAlign: 'left',
                        rowTextAlign: 'left',
                    },
                    print: {
                        printHeader: function () {
                            //                        return `<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>${headerFilename}</h1>`;
                            return `<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'></h1>`;
                        },
                        printFormatter: (tableHolder, table) => {
                            $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                            $(table).find('thead th').css({ 'font-size': '11px' });
                            $(table).find('tbody td').css({ 'font-size': '12px' });
                        },

                        printFooter: function () {
                            if (!temp_OEM) {
                                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                            <div _class="d-flex gap-2">Powered by
                            <a href="http://ai-rgus.com/" class='h7'>Ai-RGUS.COM</a>
                            </div>
                            </div>`;
                            } else {
                                return '';
                            }
                        },
                    },
                },
                this.exports
            );
        },
        //#endregion
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" fn: get_header_filename ">
        //#region - fn: get_header_filename
        get_header_filename: (sep = ' ') => {
            return $('#nav_breadcrumb_w .breadcrumb-item')
                .map(function () {
                    return $(this).text().trim();
                })
                .get()
                .join(sep);
        },
        //#endregion
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" fn: getTableDataAndColumn - gather together the data to export based on filters and columns we currently show ">
        //#region - fn: getTableDataAndColumn - gather together the data to export based on filters and columns we currently show
        getTableDataAndColumn: () => {
            const colsDefinition_ordered = this.TabulatorObj.getColumns()
                .map((column) => (column.isVisible() ? column.getDefinition() : null))
                .filter((col) => col);

            // Prepare rows data, filtered or unfiltered based on the conditions
            let rows_export_data = this.TabulatorObj.getData('active');

            return { colsDefinition_ordered, rows_export_data };
        },
        //#endregion
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" fn: getTableHeadersAndRows Proccessing the data PDF/Excel ">
        //#region - fn: getTableHeadersAndRows PDF/Excel
        getTableHeadersAndRows: (rows_export_data, colsDefinition_ordered, do_not_export_fields, type) => {
            const headers = [];
            let col_styles = [];
            let col_formula = [];
            const def = this.exportsFns.export_def();
            const rows_data = rows_export_data.map((data, idx) => {
                let row_data = type === 'PDF' ? [] : {};
                for (let i = 0; i < colsDefinition_ordered.length; i++) {
                    const colDef = colsDefinition_ordered[i];
                    if (colDef?.iTr_exp_attr?.iTrExp_addmore_fn) {
                        colDef?.iTr_exp_attr?.iTrExp_addmore_fn(colDef, data);
                    }
                    if ($.inArray(colDef.field, do_not_export_fields) !== -1) {
                        continue;
                    }
                    if (typeof data[colDef.field] === 'string') {
                        data[colDef.field] = data[colDef.field].trim();
                    }
                    if (
                        !colDef?.iTr_exp_attr?.number_as_string &&
                        typeof data[colDef.field] === 'string' &&
                        data[colDef.field] !== '' &&
                        !isNaN(data[colDef.field])
                    ) {
                        data[colDef.field] = Number(data[colDef.field]);
                    }

                    if (colDef?.iTr_exp_attr?.iTr_exp_col_handler) {
                        colDef.iTr_exp_attr.iTr_exp_col_handler(colDef, data, idx, headers, row_data, col_styles, type, col_formula);
                    } else {
                        if (
                            (type === 'EXCEL' && colDef?.iExcludeFromList?.exp_excel != 1) ||
                            (type === 'PDF' && colDef?.iExcludeFromList?.exp_pdf != 1)
                        ) {
                            if (idx === 0) {
                                // here we create the report headers, we need to do it only 1 time
                                if (colDef.field === 'rowSelection') {
                                    headers.push({ title: def.field_rowSelection.title, field: colDef.field });
                                } else {
                                    headers.push({ title: colDef.title, field: colDef.field });
                                }
                                if (colDef?.iTr_exp_attr?.[type]?.style) {
                                    col_styles[headers.length - 1] = colDef.iTr_exp_attr[type].style;
                                }
                                if (colDef?.iTr_exp_attr?.[type]?.formula) {
                                    col_formula[headers.length - 1] = colDef.iTr_exp_attr[type].formula;
                                }
                            }
                            //  const outputValue = colDef.field ==='rowSelection'? (data['is_row_selected'] ? def.field_rowSelection.text_y : def.field_rowSelection.text_n) : data[colDef.field];
                            let outputValue = data[colDef.field];
                            if (colDef.field === 'rowSelection') {
                                outputValue = data['is_row_selected'] ? def.field_rowSelection.text_y : def.field_rowSelection.text_n;
                            } else if (colDef?.iTr_exp_attr?.exp_data_enums) {
                                outputValue = colDef?.iTr_exp_attr?.exp_data_enums[data[colDef.field] ?? ''] || outputValue;
                            }
                            if (type === 'PDF') {
                                const indexExist = headers.findIndex((h) => h.field === colDef.field);
                                row_data[indexExist] = outputValue;
                            } else {
                                row_data[colDef.field] = outputValue;
                            }
                        }
                        if (data?.iTrExp_addmore?.[colDef.field]) {
                            this.exportsFns.iTrExp_addmore_fn(
                                colDef,
                                idx,
                                headers,
                                row_data,
                                col_styles,
                                type,
                                data.iTrExp_addmore[colDef.field]
                            );
                        }
                    }
                }
                return row_data;
            });

            // <editor-fold defaultstate="collapsed" desc=" use a predefined style ">
            //#region - export object
            const predefined_styles = {
                'h-left_cs_right': {
                    sh_header_row: { alignment: { horizontal: 'left' } },
                    ws_cells: { alignment: { horizontal: 'right' } },
                },
                'h-center_cs_right': {
                    sh_header_row: { alignment: { horizontal: 'center' } },
                    ws_cells: { alignment: { horizontal: 'right' } },
                },
            };

            col_styles = col_styles.map((item) => (predefined_styles[item] ? predefined_styles[item] : item));
            //#endregion
            // </editor-fold>

            return { rows_data, col_styles, headers, col_formula };
        },
        //#endregion
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" fn: iTrExp_addmore_fn ">
        //#region - fn: iTrExp_addmore_fn
        iTrExp_addmore_fn: (colDef, idx, headers, row_data, colStyles, type, iTrExp_addmore_values) => {
            iTrExp_addmore_values.h.forEach((key, index) => {
                if (type === 'EXCEL') {
                    row_data[`iTrExp_addmore_values_${colDef.field}_${index}`] = iTrExp_addmore_values.d[index];
                } else {
                    row_data.push(iTrExp_addmore_values.d[index]);
                }
                if (idx === 0) {
                    headers.push({
                        title: key,
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
            });
        },
        //#endregion
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" fn: insertCustomRow ">
        //#region - fn: insertCustomRow
        insertCustomRow: (worksheet, position = 'afterHeader', dataAndStyle = []) => {
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            let targetRow = 0;

            if (position === 'top') {
                targetRow = 0;
            } else if (position === 'afterHeader') {
                targetRow = 1;
            } else if (position === 'bottom') {
                targetRow = range.e.r + 1;
            }

            // If not inserting at the bottom, shift rows down
            if (position !== 'bottom') {
                for (let r = range.e.r; r >= targetRow; r--) {
                    for (let c = range.s.c; c <= range.e.c; c++) {
                        const oldCell = XLSX.utils.encode_cell({ r, c });
                        const newCell = XLSX.utils.encode_cell({ r: r + 1, c });
                        if (worksheet[oldCell]) {
                            worksheet[newCell] = { ...worksheet[oldCell] }; // Copy cell with style
                            delete worksheet[oldCell];
                        }
                    }
                }
            }

            // Insert the custom row with both data and style in the same array
            dataAndStyle.forEach((cell, colIdx) => {
                const cellAddress = XLSX.utils.encode_cell({ r: targetRow, c: colIdx });
                worksheet[cellAddress] = {
                    t: 's', // type string
                    v: cell.data, // cell value
                    s: cell.style || {}, // exclusive style for each cell
                };
            });

            // Update the worksheet range
            range.e.r += 1;
            worksheet['!ref'] = XLSX.utils.encode_range(range);
        },
        //#endregion
        // </editor-fold>
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" export object ">
    //#region - export object
    exportsObj = {
        // <editor-fold defaultstate="collapsed" desc=" Excel ">
        //#region - Excel
        excel: () => {
            // it download filters data automatically.
            // this.TabulatorObj.download('xlsx', `${this.localStorageKey}.xlsx`, {
            //     title: 'Report',
            //     orientation: 'portrait',
            //     documentProcessing: (workbook) => {
            //         console.log('workbook', workbook);

            //         // Return the modified workbook
            //         return workbookLatest;
            //     }
            // });
            const { XLSX } = window;
            const def = this.exportsFns.export_def();
            const do_not_export_fields = def.excel.do_not_export_fields || def.do_not_export_fields;
            const timeStamp = getCurrentTimestamp();
            let headerText = 'add a filename text';
            if (def?.excel?.fileName) {
                headerText = def.excel.fileName;
            } else {
                headerText = this.exportsFns.get_header_filename(def.excel.fileNameSeperator);
            }

            const { colsDefinition_ordered, rows_export_data } = this.exportsFns.getTableDataAndColumn('EXCEL');

            const { rows_data, headers, col_styles, col_formula } = this.exportsFns.getTableHeadersAndRows(
                rows_export_data,
                colsDefinition_ordered,
                do_not_export_fields,
                'EXCEL'
            );
            // Create a new worksheet and add data
            const worksheet = XLSX.utils.json_to_sheet(rows_data);

            // <editor-fold defaultstate="collapsed" desc=" fn: calculateColumnWidths ">
            function calculateColumnWidths(data, headers) {
                return headers.map((header, colIdx) => {
                    let maxLength = header.title.length; // Start with header length
                    data.forEach((row) => {
                        let cellVal = row[header.field] ? row[header.field].toString() : '';
                        maxLength = Math.max(maxLength, cellVal.length);
                    });

                    maxLength = maxLength + 2; // Add padding for better spacing
                    const cell_w = Math.min(maxLength, col_styles[colIdx]?.wch || maxLength); // col_styles is the cell style obj
                    return { wch: cell_w }; // +2 Add padding for better spacing
                });
            }

            // Add headers at the top of the worksheet
            XLSX.utils.sheet_add_aoa(worksheet, [headers.map((col) => col.title)], { origin: 'A1' });

            Object.keys(worksheet).forEach((cell) => {
                let { c, r } = XLSX.utils.decode_cell(cell); // Decode cell reference

                if (!cell.startsWith('!')) {
                    if (r === 0) {
                        const header_style =
                            typeof col_styles?.[c]?.sh_header_row === 'function'
                                ? col_styles[c].sh_header_row()
                                : col_styles?.[c]?.sh_header_row || {};

                        worksheet[cell].s = {
                            font: {
                                bold: true,
                                color: { rgb: '000000' }, // Optional: Black text
                            },
                            ...header_style,
                        };
                    } else {
                        if (!worksheet[cell].s) {
                            worksheet[cell].s = {
                                alignment: {
                                    vertical: 'top',
                                },
                            };
                            if (worksheet[cell].v && /^\d+(\.\d+)?%$/.test(worksheet[cell].v)) {
                                worksheet[cell].s.alignment.horizontal = 'right';
                            }
                        }
                        if (typeof col_formula?.[c] === 'function') {
                            worksheet[cell].f = col_formula[c](r + 1);
                        }
                        let cell_style =
                            typeof col_styles?.[c]?.ws_cells === 'function'
                                ? col_styles[c].ws_cells(worksheet[cell])
                                : col_styles?.[c]?.ws_cells || {};
                        cell_style = $.extend(true, worksheet[cell].s, cell_style);
                        worksheet[cell].s = {
                            ...cell_style,
                        };
                    }
                }
            });

            let colWidths = calculateColumnWidths(rows_data, headers);
            worksheet['!cols'] = colWidths;

            if (def.excel.customRow?.value?.length) {
                (def.excel.customRow?.position === 'bottom' ? def.excel.customRow.value : [...def.excel.customRow.value].reverse()).forEach(
                    (row, index) => {
                        this.exportsFns.insertCustomRow(worksheet, def.excel.customRow.position, row);
                    }
                );
            }

            // Create a new workbook, append the worksheet, and write to a file
            const workbook = XLSX.utils.book_new();

            headerText = headerText.iString_replace_by_array(['/', '-'], ['_', '_']);
            XLSX.utils.book_append_sheet(workbook, worksheet, (def.excel.whorkSheetName || headerText).slice(-31));
            XLSX.writeFile(workbook, `${headerText} ${timeStamp.date_str}.xlsx`, { compression: true });
        },
        //#endregion
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" Print ">
        //#region - Print
        print: () => {
            if (
                this.AdditionalTabulatorInitOptions.iTr_export_only_filtered_data &&
                (this.TabulatorObj.getHeaderFilters().length || this.TabulatorObj.getFilters().length)
            ) {
                // print only filtered rows
                this.TabulatorObj.print('active', true, {});
            } else {
                this.TabulatorObj.print('all', true, {});
            }
            this.TabulatorObj.setData();
        },
        //#endregion
        // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" PDF ">
        //#region - PDF
        pdf: () => {
            const { jsPDF } = window.jspdf;
            const def = this.exportsFns.export_def();
            const c_black = '#000000';
            const c_blue = '#2980ba';
            const do_not_export_fields = def.pdf.do_not_export_fields || def.do_not_export_fields;
            const timeStamp = getCurrentTimestamp();
            const { colsDefinition_ordered, rows_export_data } = this.exportsFns.getTableDataAndColumn('PDF');

            const { rows_data, headers, col_styles } = this.exportsFns.getTableHeadersAndRows(
                rows_export_data,
                colsDefinition_ordered,
                do_not_export_fields,
                'PDF'
            );

            if (def.pdf.customRow?.value?.length) {
                (def.pdf.customRow.position === 'bottom' ? def.pdf.customRow.value : [...def.pdf.customRow.value].reverse()).forEach(
                    (row) => {
                        const newRow = row.map((cell) => {
                            return cell.data;
                        });
                        if (def.pdf.customRow.position === 'bottom') {
                            rows_data.push(newRow);
                        } else {
                            rows_data.unshift(newRow);
                        }
                    }
                );
            }

            let headerText = 'add a header-filename text';
            if (def?.pdf?.fileName) {
                headerText = def?.pdf.fileName;
            } else {
                headerText = this.exportsFns.get_header_filename(def.pdf.fileNameSeperator);
            }

            const tempDoc = new jsPDF(def?.pdf?.orientation);
            tempDoc.autoTable({
                head: [headers],
                body: rows_data,
                styles: {
                    overflow: 'hidden',
                },
                horizontalPageBreak: true,
                horizontalPageBreakBehaviour: 'immediately',
                // controlling the column styles

                columnStyles: {
                    ...col_styles,
                },
                startY: def.pdf.startY,
            });
            const totalPages = tempDoc.internal.getNumberOfPages();

            // Second pass: Create the final document with footer
            const finalDoc = new jsPDF(def?.pdf?.orientation);
            const cellHandler = def?.pdf?.exp_pdf_styles;
            // console.log(col_styles)
            const pageDimensions = finalDoc.internal.pageSize;
            const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
            const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();
            finalDoc.autoTable({
                //                head: [columns],
                head: [headers],
                body: rows_data,
                styles: {
                    // cellWidth: 150
                    // halign:"center"
                    overflow: 'hidden',
                },
                horizontalPageBreak: true,
                horizontalPageBreakBehaviour: 'immediately',
                // controlling the column styles

                columnStyles: {
                    ...col_styles,
                    // access the colum with index number.
                    // 0:{
                    //     cellWidth:8,
                    // },
                    // 3:{
                    //     cellWidth:30,
                    //     overflow: 'hidden',
                    // },
                    // 4:{
                    //     cellWidth:30,
                    //     // overflow: 'hidden',
                    // }
                },
                startY: def.pdf.startY,
                didDrawPage: async function (data) {
                    const { left: leftMargin, right: rightMargin } = data.settings.margin;

                    // add header
                    finalDoc.setFontSize(10);
                    let txt = headerText;
                    let txt_w = finalDoc.getTextWidth(txt);
                    finalDoc.text(txt, pageWidth / 2 - txt_w / 2, 8);

                    // left part of the footer
                    finalDoc.setFontSize(8);
                    let x = leftMargin;
                    let y = 0;
                    let bottomY = pageHeight - 10;
                    let linkWidth = 0;
                    if (!def.isOEM) {
                        txt = 'Powered by';
                        txt_w = finalDoc.getTextWidth(txt);
                        finalDoc.text(txt, leftMargin, bottomY);
                        finalDoc.setTextColor(c_blue);

                        linkWidth = finalDoc.textWithLink('Ai-RGUS.com', (x += txt_w + 1), bottomY, {
                            url: 'https://ai-rgus.com/home',
                        });
                        finalDoc.setDrawColor(c_blue);
                        finalDoc.setLineWidth(0.2);
                        finalDoc.line(x, (y = bottomY + 1), x + linkWidth, y);
                        finalDoc.setTextColor(c_black);
                    }

                    finalDoc.text(timeStamp.date_localStr, x + linkWidth + 1, bottomY);

                    // right part of footer
                    txt = 'Page ' + data.pageNumber + ' of ' + totalPages;
                    txt_w = finalDoc.getTextWidth(txt);
                    finalDoc.text(txt, pageWidth - rightMargin - txt_w - 1, bottomY);
                },
                didParseCell(data) {
                    if (data.section === 'head') {
                        data.cell.styles.fillColor = def.pdf.header_fillColor;
                        data.cell.styles.textColor = def.pdf.header_textColor;
                    }
                    if (data.section === 'body' && def.pdf.customRow?.value?.length) {
                        const isTop = def.pdf.customRow.position === 'top' || def.pdf.customRow.position === 'afterHeader';
                        const customRows = def.pdf.customRow.value;
                        const field = data.column.dataKey;

                        if (isTop && data.row.index < customRows.length) {
                            const fieldDef = customRows[data.row.index]?.[field];
                            if (fieldDef?.style) {
                                Object.assign(data.cell.styles, fieldDef.style);
                            }
                        }

                        if (!isTop) {
                            const customRowStart = rows_data.length - customRows.length;
                            if (data.row.index >= customRowStart) {
                                const rowIndexInCustom = data.row.index - customRowStart;
                                const fieldDef = customRows[rowIndexInCustom]?.[field];
                                if (fieldDef?.style) {
                                    Object.assign(data.cell.styles, fieldDef.style);
                                }
                            }
                        }
                    }
                    if (cellHandler) {
                        cellHandler(data, headers[data.column.dataKey], data.cell.text[0], finalDoc);
                    }
                },
                // didDrawCell: (data) => {
                //     const colDef = headers[data.column.index];
                //     if (colDef.field === "name" && data.cell.section === "body") {
                //         const { x, y, width, height } = data.cell;

                //         const text = data.cell.text[0];

                //         // Clear the cell text
                //         finalDoc.setFillColor(data.cell.styles.fillColor); // White background to clear the cell
                //         finalDoc.rect(x, y, width, height, 'F');

                //         // Draw the hyperlink
                //         finalDoc.setTextColor(c_blue);
                //         finalDoc.textWithLink(text, x + 2, y + height / 2 + 2, { url: 'https://chatgpt.com/c/677d6e68-7294-8003-8979-69ee5576cf1f' });

                //         // Reset the text color for subsequent text
                //         finalDoc.setTextColor(c_black);

                //         // Clear the cell's text to prevent the original text from being rendered
                //         data.cell.text = [""];
                //     }
                // }
            });

            //            finalDoc.save('table.pdf');

            finalDoc.save(headerText.iString_replace_by_array([' ', '/', '-'], ['', '_', '_']) + '-' + timeStamp.date_str + '.pdf');
        },
        //#endregion
        // </editor-fold>
    };
    //#endregion
    // </editor-fold>
    //#endregion
    // </editor-fold>
}
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fn: adding tooltip to column header ">
//#region -adding tooltip to column header
function addTooltipToTheColumns(CustomTbrObj, tooltipColumns) {
    /*  To use any other Bootstrap/proper options https://getbootstrap.com/docs/5.2/components/tooltips/#options just add to the calling object whatever options you wish like;
     *
     *  const tooltipColumns = [
     *       { field: 'w',  customClass:"tt_width-250 tt_inner-250", position: "left", additionals: {offset:[0,0], trigger:'click', delay:{"show":1500, "hide":2100}} },
     *   ];
     *
     * +i+ add tt to a nestaed table
     *  in the HTML add this attr tt_for-L2="1" to <div class="d-none" tt_for-L2="1" tt_for-field="uptime"><div>tt text</div></div>
     *  use this to "bring" the tt elements to the nested table; now it is like it is not nestled
     *      const $tt_ems = $("[tt_for-L2]", `.${row_expanded.getTable().element.id}-container`);
     *       $(CustomTabulator.tableContainerElement).append($tt_ems.clone());
     *
     *
     */
    tooltipColumns.forEach((opts) => {
        const options = {
            field: null,
            content: null, // if null we will take it from element with attribute tt_for-field="options.field"
            position: 'top',
            offset: [0, 0],
            customClass: '', // "tooltip-info" is the default to replace and or add class(es) use "tooltip-info tooltip-danger tt_width-600" we will toggle it.
            customToolTipItem: $(`<i class='far fa-info-circle text-dark pe-2'></i>`),
            ...opts,
        };

        if (options.content === null) {
            //            options.content = $(`[tt_for-field=${options.field}]`).contains().clone();
            // +IR+ we need a better way to do it
            options.content = $('<div>').append(
                $(`[tt_for-field=${options.field}]`, CustomTbrObj.tableContainerElement).contents().clone()
            )[0];
        }
        options.customClass = $('<div>').addClass('tooltip-info').toggleClass(options.customClass).attr('class');

        const element = new bootstrap.Tooltip(options.customToolTipItem, {
            placement: options.position,
            offset: options.offset,
            customClass: options.customClass,
            title: options.content,
            html: true,
            ...options?.additionals,
        })._element; // _element is coming from bootstrap tooltip
        /*
        const element = new bootstrap.Popover(tooltipItem, {
            placement: options.position,
            customClass: options.customClass,
            title: options.content,
            html: true,
            trigger: "hover focus"
        })._element; // _element is coming from bootstrap tooltip
*/
        $(CustomTbrObj.TabulatorObj.element).find(`div[tabulator-field='${options.field}'] .tabulator-col-title`).prepend(element);
    });
}

// <editor-fold defaultstate="collapsed" desc=" COMMENT Tooltip ">
//#region -COMMENT Tooltip
class __Tooltip {
    constructor(args, customToolTipItem) {
        const options = {
            content: 'write a text',
            position: 'top',
            customClass: 'tooltip-info',
            elClass: 'fa fa-info-circle text-dark pe-2',
            ...args,
        };

        let tooltipItem = $(`<i class='${options.elClass}'></i>`);
        if (customToolTipItem) {
            tooltipItem = customToolTipItem;
        }
        // if (_userStr == 'dummy') {
        //     tooltipItem = $(`<span><i class="fa-solid fa-info pe-2"></i></span>`);
        // }

        this.element = new bootstrap.Tooltip(tooltipItem, {
            placement: options?.position,
            customClass: options?.customClass,
            title: options.content,
            html: true,
        })._element; // _element is coming from bootstrap tooltip
    }

    // constructor(
    //     options = { content: 'write a text', position: 'top', customClass: 'tooltip-info', elClass: 'far fa-info-circle text-dark pe-2' },
    //     customToolTipItem
    // ) {
    //     let tooltipItem = $(`<i class='${options.elClass ?? 'fa fa-info-circle text-dark pe-2'}'></i>`);
    //     if (customToolTipItem) {
    //         tooltipItem = customToolTipItem;
    //     }
    //     // if (_userStr == 'dummy') {
    //     //     tooltipItem = $(`<span><i class="fa-solid fa-info pe-2"></i></span>`);
    //     // }

    //     this.element = new bootstrap.Tooltip(tooltipItem, {
    //         placement: options?.position ?? 'top',
    //         customClass: options?.customClass ?? 'tooltip-info tt_width-600',
    //         title: options.content ?? 'default title',
    //         html: true,
    //     })._element;

    //     //        $(this.element).tooltip("show");
    //     //                data-bs-toggle="tooltip"
    //     //                data-bs-placement="${options.position ?? 'bottom'}"
    //     //                data-bs-html="true"
    //     //                data-bs-custom-class="${options.customClass ?? ''}"
    //     //                title='${content}'
    //     //                class='${options.class ?? ''}'
    //     //            >
    //     //                <i class="fa-solid fa-info"></i>
    //     //            </span>`).tooltip();
    // }

    // defaultElement = $(`<i class='fa fa-info-circle text-dark pe-2'}'></i>`)

    // constructor(columns) {
    //     columns.forEach((col) => {
    //         const element = new bootstrap.Tooltip(col.customElement ?? this.defaultElement, {
    //             placement: options?.position ?? 'top',
    //             customClass: options?.customClass ?? 'tooltip-info tt_width-600',
    //             title: options.content ?? 'default title',
    //             html: true,
    //         })._element;
    //         $(this.TabulatorObj.element).find(`div[tabulator-field='${col.field}'] .tabulator-col-title`).prepend(element);
    //     });
    // }

    /* 
    constructor(content, options = { position: 'bottom', customClass: 'bg-sucess', class: '' }) {
        this.element = $(`<span
                data-bs-toggle="tooltip"
                data-bs-placement="${options.position ?? 'bottom'}"
                data-bs-html="true"
                data-bs-custom-class="${options.customClass ?? ''}"
                title='${content}'
                class='${options.class ?? ''}'
            >
                <i class="fa-solid fa-info"></i>
            </span>`).tooltip();
    }
    */
}
// above the new logic for rendering the tooltips
// class Tooltip {
//     // constructor(
//     //     options = { content: 'write a text', position: 'top', customClass: 'tooltip-info', elClass: 'far fa-info-circle text-dark pe-2' },
//     //     customToolTipItem
//     // ) {
//     //     let tooltipItem = $(`<i class='${options.elClass ?? 'fa fa-info-circle text-dark pe-2'}'></i>`);
//     //     if (customToolTipItem) {
//     //         tooltipItem = customToolTipItem;
//     //     }
//     //     // if (_userStr == 'dummy') {
//     //     //     tooltipItem = $(`<span><i class="fa-solid fa-info pe-2"></i></span>`);
//     //     // }

//     //     this.element = new bootstrap.Tooltip(tooltipItem, {
//     //         placement: options?.position ?? 'top',
//     //         customClass: options?.customClass ?? 'tooltip-info tt_width-600',
//     //         title: options.content ?? 'default title',
//     //         html: true,
//     //     })._element;

//     //     //        $(this.element).tooltip("show");
//     //     //                data-bs-toggle="tooltip"
//     //     //                data-bs-placement="${options.position ?? 'bottom'}"
//     //     //                data-bs-html="true"
//     //     //                data-bs-custom-class="${options.customClass ?? ''}"
//     //     //                title='${content}'
//     //     //                class='${options.class ?? ''}'
//     //     //            >
//     //     //                <i class="fa-solid fa-info"></i>
//     //     //            </span>`).tooltip();
//     // }

//     // defaultElement = $(`<i class='fa fa-info-circle text-dark pe-2'}'></i>`)

//     // constructor(columns) {
//     //     columns.forEach((col) => {
//     //         const element = new bootstrap.Tooltip(col.customElement ?? this.defaultElement, {
//     //             placement: options?.position ?? 'top',
//     //             customClass: options?.customClass ?? 'tooltip-info tt_width-600',
//     //             title: options.content ?? 'default title',
//     //             html: true,
//     //         })._element;
//     //         $(this.TabulatorObj.element).find(`div[tabulator-field='${col.field}'] .tabulator-col-title`).prepend(element);
//     //     });
//     // }

//     /*
//     constructor(content, options = { position: 'bottom', customClass: 'bg-sucess', class: '' }) {
//         this.element = $(`<span
//                 data-bs-toggle="tooltip"
//                 data-bs-placement="${options.position ?? 'bottom'}"
//                 data-bs-html="true"
//                 data-bs-custom-class="${options.customClass ?? ''}"
//                 title='${content}'
//                 class='${options.class ?? ''}'
//             >
//                 <i class="fa-solid fa-info"></i>
//             </span>`).tooltip();
//     }
//     */
// }
//#endregion
// </editor-fold>
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" COMMENT: class Dropdown ">
//#region -COMMENT: class Dropdown
// class Dropdown {
//     element = null;
//     parentElement = null;
//     listItemsArr = [];

//     constructor(element, parent, { listItemsArr } = {}) {
//         this.element = $(element);
//         this.parentElement = $(parent);
//         this.parentElement.append(this.element);

//         this.listItemsArr = listItemsArr;
//     }

//     addButton(btnElement) {
//         this.element.append(btnElement);
//         return this;
//     }

//     addDropdownMenu(menuElement, cb) {
//         this.element.append(menuElement);
//         cb.call(this, this.listItemsArr);
//         return this;
//     }

//     initDropdownEvents(cb) {
//         cb.call(this);
//         return this;
//     }
// }
//#endregion
// </editor-fold>
// <editor-fold defaultstate="collapsed" desc=" COMMENT: fn: get_row_ids_to_select ">
//#region -COMMENT: fn: get_row_ids_to_select
/*function get_row_ids_to_select(fTable_class){
    let ids_arr = "";
    if (fTable_class.TabulatorObj.getColumn("rowSelection").getDefinition()["selectActiveRowsOnly"]){
        ids_arr = fTable_class.TabulatorObj.getData().filter(item => item.tr_c === "").map(item => item.id);
        if(! ids_arr.length){
            ids_arr = [-1];
        }
    }
    return ids_arr;
}*/
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" COMMENT: Loader & Loader error ">
//#region -COMMENT: Loader & Loader error
// NOt in used replace by Ai-RGUS' loader
var dataLoaderLoading = `
    <style>
        .loaderss {
            width: 50px;
            padding: 8px;
            aspect-ratio: 1;
            border-radius: 50%;
            background: #2527b0;
            --_m: 
                conic-gradient(#0000 10%,#000),
                linear-gradient(#000 0 0) content-box;
            -webkit-mask: var(--_m);
                mask: var(--_m);
            -webkit-mask-composite: source-out;
                mask-composite: subtract;
            animation: l3 1s infinite linear;
        }
        @keyframes l3 {to{transform: rotate(1turn)}}
    </style>
    <div class="loaderss"></div>
  `;
var dataLoaderError = `<div class="">Failed to load data</div>`;
//#endregion
// </editor-fold>

var Store = {
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
    remove: (key) => localStorage.removeItem(key),
};

function handleKeyDown(e, onChange, cancel) {
    if (e.key === 'Enter') {
        onChange();
    }
    if (e.key === 'Escape') {
        cancel();
    }
}

// <editor-fold defaultstate="collapsed" desc=" COMMENT: deepClone ">
//#region -COMMENT: deepClone
// It is used to clone js objects
// const copy = deepClone(object)
/*function deepClone(input) {
    if (input === null || typeof input !== 'object') {
        return input;
    }
    const initialValue = Array.isArray(input) ? [] : {};
    return Object.keys(input).reduce((acc, key) => {
        acc[key] = deepClone(input[key]);
        return acc;
    }, initialValue);
}*/
//#endregion
// </editor-fold>

function focusInputOnLoad(inputEle) {
    $(inputEle).trigger('focus');
}

function shouldRunAndProceed(fn, ...args) {
    let isPassed = true;
    if (typeof fn == 'function') {
        isPassed = fn(...args);
    }
    return isPassed;
}
function shouldRunAndProceed_new(fn, isCall = false, ...args) {
    let isPassed = true;
    if (typeof fn == 'function') {
        if (isCall) {
            isPassed = fn.call(...args);
        } else {
            isPassed = fn(...args);
        }
    }
    return isPassed;
}

function isColumnVisible(colName) {
    return this.DefaultHiddenColumns.includes(colName)
        ? false
        : this.TableSettings.persist_column_visibility.enabled
        ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes(colName)
        : true;
}

function getHiddenCols() {
    return this.getColumns()
        .filter((col) => !col.isVisible())
        .map((col) => col.getDefinition().field);
}

function getCurrentTimestamp() {
    _iGUdates = new _iGU_dates();
    let date_localStr = _iGUdates.get_date_formated({ fmt: 'localStr' });
    let date_str = _iGUdates.get_date_formated({ fmt: 'yyyySPmmSPddSPhhSPmmSPss', time_separator: '-', dateTime_separator: '_' });
    return { date_localStr: date_localStr, date_str: date_str };

    //    return luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');
}

// <editor-fold defaultstate="collapsed" desc=" Nested table(s) ">
//#region -Nested table(s)
// <editor-fold defaultstate="collapsed" desc=" fn: cellF_rowExpand ">
//#region -fn: cellF_rowExpand
function __cellF_rowExpand(cell, formatterParams, onRendered) {
    let row = cell.getRow();
    let returnVal = null;

    const button = $(
        `<button type="button" class="expand-btn btn btn-sm btn-success m-0 p-0"><i class="fas fa-plus px-1"></i></button>`
    ).click((e) => {
        const isExpanded = $(e.target).closest('button').data('expanded');
        if (isExpanded) {
            deleteTableAndCollapseRow(e, row);
        } else {
            expandRowWithNestedTable_Level1(e, row);
        }
    });

    returnVal = $(button)[0];
    return returnVal;
}
//#endregion
// </editor-fold>
// <editor-fold defaultstate="collapsed" desc=" fn: deleteTableAndCollapseRow ">
//#region -fn: deleteTableAndCollapseRow
function deleteTableAndCollapseRow(e, row) {
    // on collapse - hide dropdown and popovers
    iBS_hideAll_Popovers();
    iBS_hideAll_Dropdowns();

    //    $(e.target).data('expanded', false);
    //    $(e.target).html('+');
    //    $(e.target).addClass('bg-primary');
    //    $(e.target).removeClass('bg-danger');

    let btn = $(e.target).closest('button');
    $(btn).data('expanded', false).removeClass('btn-danger').addClass('btn-success');
    $('i', btn).removeClass('fa-minus').addClass('fa-plus');

    $(row.getElement()).find('div.table-container').remove();
}
//#endregion
// </editor-fold>
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fn: iGet_el_MasterFilter ">
//#region -fn: iGet_el_MasterFilter
function iGet_el_MasterFilter(opt = {}) {
    let def = {
        tmpl: '#TMPL_master_search_w',
        el_w: { class: 'master_search_w', style: null },
        input_el: { class: null, style: null },
    };
    opt = $.extend(true, def, opt);

    let el_w = $(opt.tmpl).clone(true).removeAttr('id').removeClass('d-none');
    $(el_w).toggleClass(opt.el_w.class).attr('style', opt.el_w.style);
    $('input', el_w).toggleClass(opt.input_el.class).attr('style', opt.input_el.style);

    return el_w;
}
//#endregion
// </editor-fold>
// <editor-fold defaultstate="collapsed" desc=" fn: iGet_el_SelectDropdown ">
//#region -fn: iGet_el_SelectDropdown - NOT in USE just to test - an old version
function iGet_el_SelectDropdown(ops = {}) {
    let def = {
        TabulatorObj: {}, // this is our main class
        calling_for: null, // dataList| dataList_allow_addtions
        dd_src_input_enter_add_value: false,
        tmpl: '#TMPL_dropdownSelection_withFilterAndApply',
        el_w: { class: null, style: null },
        calling_btn: { class: null, style: null, icon: { class: null, style: null }, alt_el: null }, // The button we click to activate the dropdown
        dd_element: { class: null, style: 'width:250px; height:300px;' }, // the element opened once we click on the calling btn
        dd_title: { class: null, style: null, text: null },
        dd_filter: {
            class: null,
            style: null,
            input: { class: null, style: null, type: 'search', placeholder: 'Search...' },
            'rest_filter_input_on-dd_exit': true,
        },
        dd_select_all: { class: null, style: '', initialVal: true, text: { ched: 'Deselect all', clear: 'Select all' } },
        dd_select_list: {
            data: [],
            dVal: 'field',
            dTxt: 'title',
            exludeBy: null, // must have attr 'visible: 1' if we want to show the check box, checked
            class: null,
            style: 'width:240px; height:100%; overflow-y:auto;',
            attributeKey: null,
        },
        separtor_el: { val: '---', style: null, class: null },
        fn_onSelectAllChange: null, // if it returns false we will bypass the default code
        fn_onInptChkChange: null,
        fn_onDropdown_shown: null,
        fn_onDropdown_hidden: null,
        // applayBtns    : {}, not in use for teh moment
    };
    ops = $.extend(true, def, ops);
    let selDD_el = $(ops.tmpl).clone(true).removeAttr('id').toggleClass('d-none');
    let _sDd_id = 'a' + Date.now(); // only number as id is not good

    function addAttributeToElements(element, item, attributeKey) {
        const attribute = item?.[attributeKey];
        if (!attributeKey || !attribute) {
            return element;
        }
        element.attr(attribute);
        return element;
    }

    // <editor-fold defaultstate="collapsed" desc=" fn: create_all_checkboxes ">
    //#region -fn: create_all_checkboxes
    function create_all_checkboxes(selDD_el) {
        let ii = 1;
        let _chBox_el = $('#TMPL_checkbox', ops.tmpl).clone(true).removeAttr('id').toggleClass('d-none d-block');
        $('.dds_itemsList_w', selDD_el).empty();

        ops.dd_select_list.data.forEach((listItem) => {
            //        iConsole("--- create dd chboxs",{listItem},listItem.iExcludeFromList?.[ops.dd_select_list.exludeBy]);
            if (listItem.iExcludeFromList?.[ops.dd_select_list.exludeBy] === 0) {
                // exludeBy is our attribute array exists only if necessary in the column definition
                return true;
            }
            iConsole({ listItem }, listItem['dinm_dd_toCcheck'], listItem['field'], listItem['initialChecked'], listItem.visible);

            let chBox_el = $(_chBox_el).clone(true);

            let data_hidden_from_menu = null;
            let isToCheckIt = null;
            if (ops.calling_for === 'masterSearch') {
                data_hidden_from_menu = !listItem.visible && listItem.hidden_by_user;
                isToCheckIt = listItem.dinm_dd_toCcheck ?? !listItem.hidden_by_user ?? 1;
            } else if (ops.calling_for === 'colsVisibility') {
                data_hidden_from_menu = !listItem.visible && !listItem.hidden_by_user;
                isToCheckIt = listItem.dinm_dd_toCcheck ?? !listItem.hidden_by_user ?? 1;
            } else if (ops.calling_for === 'name_datalist') {
                isToCheckIt = 0;
            } else {
                data_hidden_from_menu = !(listItem.visible || true);
                isToCheckIt = listItem.dinm_dd_toCcheck ?? 1;
            }

            $(chBox_el).attr('data-hidden-from-menu', data_hidden_from_menu);
            if (ops.calling_for === 'masterSearch') {
                $(chBox_el).attr('data-hidden-by-col_view', data_hidden_from_menu);
            }

            let _id = `el_${ii++}_${performance.now().toString().replace('.', '_')}`; // only number as id is not good and '.' can not be part of the id string
            //        let isToCheckIt = listItem.dinm_dd_toCcheck?? !listItem.hidden_by_user?? 1;
            //        $("input", chBox_el).attr({"id": _id, "value": `${listItem?.[ops.dd_select_list.dVal]}`}).prop("checked", listItem.dinm_dd_toCcheck?? 1);
            const text = listItem?.[ops.dd_select_list.dTxt];
            const plainText = typeof text === 'string' ? text.replace(/<[^>]*>/g, '') : ''; // Removes all HTML tags
            $('input', chBox_el)
                .attr({ id: _id, value: `${listItem?.[ops.dd_select_list.dVal]}` })
                .prop('checked', isToCheckIt);
            $('label', chBox_el).attr({ for: _id, title: plainText }).empty().append(`${listItem?.[ops.dd_select_list.dTxt]}`).css({
                'white-space': 'nowrap',
                overflow: 'hidden',
                'text-overflow': 'ellipsis',
                width: '100%',
            });
            $('.dds_itemsList_w', selDD_el).append(chBox_el);
            if (ops.calling_btn.type === 'button') {
                // Hide the checkbox visually
                chBox_el.addClass('d-none'); // Hide the checkbox visually
                let button_el;
                if (ops.separtor_el.val === listItem?.[ops.dd_select_list?.dVal]) {
                    button_el = $(`<div style="${ops.separtor_el.style}">${listItem?.[ops.dd_select_list.dTxt]}</div>`);
                } else {
                    // Create button element
                    button_el = $('<button/>', {
                        id: _id,
                        type: 'button',
                        class: 'btn btn-option dropdown_list_btn', // Customize the button class as needed
                        value: listItem?.[ops.dd_select_list.dVal],
                        title: plainText,
                    })
                        .empty()
                        .append(`${listItem?.[ops.dd_select_list.dTxt]}`)
                        .on('click', function () {
                            // Handle button click event
                            const isActive = $(this).attr('data-active') === 'true';

                            if (!isActive) {
                                $(this).attr('data-active', 'true'); // Activate button by setting attribute
                                $('input#' + _id).prop('checked', true); // Check hidden checkbox
                            } else {
                                $(this).attr('data-active', 'false'); // Deactivate button by removing attribute
                                $('input#' + _id).prop('checked', false); // Uncheck hidden checkbox
                            }
                            ops?.calling_btn?.click(button_el, $('input#' + _id).val(), listItem);
                            const dropdownToggle = $('.iDDselnWfilter_btn', $(selDD_el));
                            bootstrap.Dropdown.getInstance(dropdownToggle)?.hide();
                        });
                }
                addAttributeToElements(button_el, listItem, ops?.dd_select_list?.attributeKey);
                // Append button to the list
                $('.dds_itemsList_w', selDD_el)
                    .addClass('download-btns')
                    .css({
                        'overflow-y': 'scroll', // Keeps content scrollable
                        // "padding": "unset !important",
                        'background-color': 'white',
                        display: 'flex',
                        'align-items': 'center',
                        'scrollbar-width': 'thin',
                    })
                    .append(button_el);
            } else {
                // If the type is not 'button', the checkbox will be visible (not hidden)
                addAttributeToElements(chBox_el, listItem, ops?.dd_select_list?.attributeKey);
                $('.dds_itemsList_w', selDD_el).append(chBox_el); // Append visible checkbox
            }
        });

        if ($.inArray(ops.calling_for, ['masterSearch', 'colsVisibility']) !== -1) {
            set_selectAll_indicators({ target: 'test' });
        }
    }
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" fn: set_selectAll_indicators: set icon + text of checkbox all ">
    //#region -fn: set_selectAll_indicators
    function set_selectAll_indicators(e) {
        const $chBoxs_els = $(".dds_itemsList_w .form-check[data-hidden-from-menu='false']", selDD_el); // Select all visible checkboxes in the container
        const totalCheckboxes = $chBoxs_els.length;
        const checkedCheckboxes = $('input', $chBoxs_els).filter(':checked').length;

        iConsole(
            'ddown chbox on change',
            { totalCheckboxes, checkedCheckboxes },
            e.target,
            $(".dds_itemsList_w .form-check[data-hidden-from-menu='true']", selDD_el)
        );
        if (checkedCheckboxes === 0) {
            $('.select_deselec_all_w input', selDD_el).prop({ checked: 0, indeterminate: 0 });
            //            $(".select_deselec_all_w label", selDD_el).text("Select all");
            $('.select_deselec_all_w label', selDD_el).text(ops.dd_select_all.text.clear);
        } else if (checkedCheckboxes === totalCheckboxes) {
            $('.select_deselec_all_w input', selDD_el).prop({ checked: 1, indeterminate: 0 });
            //            $(".select_deselec_all_w label", selDD_el).text("Deselect all");
            $('.select_deselec_all_w label', selDD_el).text(ops.dd_select_all.text.ched);
        } else {
            $('.select_deselec_all_w input', selDD_el).prop('indeterminate', 1);
            //            $(".select_deselec_all_w label", selDD_el).text("Deselect all");
            $('.select_deselec_all_w label', selDD_el).text(ops.dd_select_all.text.ched);
        }

        $('.badge', selDD_el).remove();
        let badge_nr = totalCheckboxes - checkedCheckboxes;
        if (badge_nr > 0) {
            $(selDD_el).append(
                `<span class="position-absolute translate-middle badge rounded-pill bg-primary" style="margin-left: -10px">${badge_nr}</span>`
            );
        }
    }

    // need to run this to show the badge counter and update the select-all checkbox status on initial load
    // direct all is not working, so calling it inside the setTimeout
    // ++Test++
    // setTimeout(()=>{
    // set_selectAll_indicators({})
    // })

    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" COMMENT - bootstrap close element ">
    //#region -COMMENT
    /*setTimeout(()=>{
//        bb = bootstrap.Dropdown.getInstance(selDD_el);    

//    
    var dropdown = new bootstrap.Dropdown(selDD_el[0], {
      autoClose: 'outside' // Set autoClose to 'outside', 'inside', 'true', or 'false'
    });
    
    }, 5000);
    
//  var dd = new bootstrap.Dropdown(selDD_el, {
//    autoClose: 'outside' 
//  });*/
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" setting calling and the dropdown window exterra ">
    //#region -setting calling and the dropdown window exterra
    $(selDD_el).toggleClass(ops.el_w.class).attr('style', ops.el_w.style);

    // <editor-fold defaultstate="collapsed" desc=" show.bs.dropdown ">
    //#region -show.bs.dropdown
    $(selDD_el).on('show.bs.dropdown', function () {
        // hide all other open dropdowns before the dropdown is added to dom and by that activate the $(selDD_el).on("hidden.bs.dropdown", function(){
        // iConsole("dropdown btn show.bs.dropdown");
        iBS_hideAll_Dropdowns();
        iBS_hideAll_Popovers();
    });
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" shown.bs.dropdown ">
    //#region -shown.bs.dropdown
    $(selDD_el).on('shown.bs.dropdown', function (e) {
        iConsole('dropdown btn shown.bs.dropdown');
        if (!shouldRunAndProceed(ops.fn_onDropdown_shown, e, ops, create_all_checkboxes)) {
            return;
        }
        if (!ops?.calling_btn?.removeFontBold) {
            $('.iDDselnWfilter_btn', selDD_el).addClass('fw-bold');
        }
        $('.iDDselnWfilter_btn i', selDD_el).toggleClass('fal far');
        setTimeout(() => {
            $('.filterByValue input', $(`[data-for_seldd_id="${$('.iDDselnWfilter_btn', selDD_el).attr('id')}"]`)).focus();
        });

        // We use this when we must move the dropdown window to the <body> if not we do not see the dropdown
        if ($(selDD_el).hasClass('move_ddown_to_body') && $('ul.dropdown-menu', selDD_el).length) {
            $('ul.dropdown-menu', selDD_el).addClass('moved_ddown_to_body').appendTo('body');
            $('.moved_ddown_to_body .form-check-input', 'body').removeClass('form-control form-control-sm');
        }
    });
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" hidden.bs.dropdown ">
    //#region -hidden.bs.dropdown
    $(selDD_el).on('hidden.bs.dropdown', function (e) {
        iConsole('dropdown btn hidden.bs.dropdown');
        if (!shouldRunAndProceed(ops.fn_onDropdown_hidden, e, ops)) {
            return;
        }
        let $ddownWin_el = $(`[data-for_seldd_id="${$('.iDDselnWfilter_btn', selDD_el).attr('id')}"]`);
        let $filterByValue_el = $('.filterByValue', $ddownWin_el);

        setTimeout(() => {
            if (ops['dd_filter']['rest_filter_input_on-dd_exit']) {
                $('input', $filterByValue_el).val('').change();
            } else {
                $('input', $filterByValue_el).change();
            }
        });

        $('.iDDselnWfilter_btn', selDD_el).removeClass('fw-bold');
        $('.iDDselnWfilter_btn i', selDD_el).toggleClass('fal far');

        // $(`[data-for_seldd_id="${$('.dropdown-toggle', selDD_el).attr("id")}"]`).appendTo(selDD_el);
    });
    //#endregion
    // </editor-fold>

    $('.iDDselnWfilter_btn', selDD_el)
        .toggleClass(ops.calling_btn.class)
        .attr({ style: ops.calling_btn.style, id: _sDd_id })
        .on('click', (e) => {
            let $el_dd_w = $(`[data-for_seldd_id="${$('.iDDselnWfilter_btn', selDD_el).attr('id')}"]`);
            $('.filterByValue input', $el_dd_w).val('');
        });
    if ((ops.calling_btn.alt_el || '') === '') {
        $('.iDDselnWfilter_btn .btn_icon', selDD_el).toggleClass(ops.calling_btn.icon.class).attr('style', ops.calling_btn.icon.style);
    } else {
        $('.iDDselnWfilter_btn .btn_icon', selDD_el).remove();
        $('.iDDselnWfilter_btn', selDD_el).append(ops.calling_btn.alt_el);
    }

    // the dropdown element
    $('.dropdown-menu', selDD_el)
        .toggleClass(ops.dd_element.class)
        .attr({ style: ops.dd_element.style, 'data-for_seldd_id': _sDd_id })
        .click((e) => e.stopPropagation());

    $('.ddM_title', selDD_el).text(ops.dd_title.text).toggleClass(ops.dd_title.class).attr('style', ops.dd_title.style);

    $('.select_deselec_all_w', selDD_el).toggleClass(ops.dd_select_all.class).attr('style', ops.dd_select_all.style);
    $('.select_deselec_all_w .form-check-label', selDD_el).text(ops.dd_select_all.text.ched);
    let _id = 'a' + Date.now(); // only number as id is not good
    $('.select_deselec_all_w input', selDD_el).attr('id', _id);
    $('.select_deselec_all_w label', selDD_el).attr('for', _id);

    $('.dds_itemsList_w ', selDD_el).toggleClass(ops.dd_select_list.class).attr('style', ops.dd_select_list.style);
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" filterByValue input: set it upand in input change ">
    //#region -setting calling and the dropdown window els
    $('.filterByValue', selDD_el).toggleClass(ops.dd_filter.class).attr('style', ops.dd_filter.style);
    $('.filterByValue input', selDD_el)
        .attr({ placeholder: ops.dd_filter.input.placeholder, type: ops.dd_filter.input.type, style: ops.dd_filter.input.style })
        .toggleClass(ops.dd_filter.input.class)
        .on('keydown', function (e) {
            // add value to input if ops.calling_for == "datalist" and below flag is true
            if (ops.dd_src_input_enter_add_value) {
                if (e.key === 'Enter') {
                    ops.fn_onInptChkChange?.(e);
                    iBS_hideAll_Dropdowns();
                    // $(e.target).closest(".dds_itemsList_w input")
                    // $(e.target).closest(".dropdown-menu").find(".dds_itemsList_w input").prop('checked',0)
                }
            }
        })
        .on('input change', function (e) {
            iConsole('filterByValue input', selDD_el);
            //            searchList.call(this, e, tbl_ColumsToggleVisib_menu, 'data-hidden-from-menu');

            var value = $.trim($(this).val().toLowerCase());
            $chBoxs = $(
                ".dds_itemsList_w .form-check:not([data-hidden-by-col_view='true']), .dds_itemsList_w .btn:not([data-hidden-by-col_view='true'])",
                $(`[data-for_seldd_id="${$('.iDDselnWfilter_btn', selDD_el).attr('id')}"]`)
            );
            $chBoxs.attr('data-hidden-from-menu', false);

            $chBoxs.each(function () {
                let setTo = $.trim($(this).text()).toLowerCase().includes(value);
                $(this).toggle(setTo).attr('data-hidden-from-menu', !setTo);
                if (setTo) {
                    $(this).addClass('d-block');
                } else {
                    $(this).removeClass('d-block');
                }
            });

            //iConsole($(".dds_itemsList_w .form-check[data-hidden-from-menu='false']", selDD_el).length, value);
            // show/hide the select all based on if thereis what to select
            $('.select_deselec_all_w', selDD_el).toggle(
                $(".dds_itemsList_w .form-check[data-hidden-from-menu='false']", selDD_el).length > 0
            );

            set_selectAll_indicators(e);
        });
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" Select ALL: settings, on change ">
    //#region -creating and managing the checkbox list
    $('.select_deselec_all_w input', selDD_el).prop('checked', ops.dd_select_all.initialVal);
    $('.select_deselec_all_w input', selDD_el).change(function (e) {
        if (typeof ops.fn_onSelectAllChange === 'function') {
            if (!ops.fn_onSelectAllChange?.(e, ops)) {
                return true;
            }
        }

        if ($(selDD_el).hasClass('move_ddown_to_body')) {
            selDD_el = $(`[data-for_seldd_id="${$('.iDDselnWfilter_btn', selDD_el).attr('id')}"]`);
        }

        //        if (tbl_int_mode == 'paginated-local') {
        //  We are selecting all the relevat elements for what we want to do and we apply the .click() to them
        if (e.target.checked) {
            $(".dds_itemsList_w [data-hidden-from-menu='false'] input:is(:not(:checked))", selDD_el).click();
        } else {
            $(".dds_itemsList_w [data-hidden-from-menu='false'] input:is(:checked)", selDD_el).click();
        }
        //            set_selectAll_indicators(e);
        //            } else {
        //                iTr_searchFnQuery($(src_el).val());
        //            }
    });
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" Checkbox list: creating, settings, and on change ">
    //#region -creating and managing the checkbox list
    if (ops.dd_select_list.data.length != 0) {
        create_all_checkboxes(selDD_el);
    }

    // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
    //#region -COMMENT
    //    let ii = 1;
    //    let _chBox_el = $("#TMPL_checkbox", ops.tmpl).clone(true).removeAttr('id').toggleClass('d-none d-block');
    //    ops.dd_select_list.data.forEach((listItem) => {
    ////        iConsole("--- create dd chboxs",{listItem},listItem.iExcludeFromList?.[ops.dd_select_list.exludeBy]);
    //        if(listItem.iExcludeFromList?.[ops.dd_select_list.exludeBy] === 0){ // exludeBy is our attribute array exists only if necessary in the column definition
    //            return true;
    //        }
    //        iConsole({listItem}, listItem['dinm_dd_toCcheck'], listItem['field'],listItem["initialChecked"], listItem.visible );
    //
    //        let chBox_el = $(_chBox_el).clone(true);
    //
    //        let data_hidden_from_menu = null;
    //        let isToCheckIt = null;
    //        if(ops.calling_for === "masterSearch"){
    //            data_hidden_from_menu = !listItem.visible && listItem.hidden_by_user;
    //            isToCheckIt = listItem.dinm_dd_toCcheck?? !listItem.hidden_by_user?? 1;
    //        } else if(ops.calling_for === "colsVisibility"){
    //            data_hidden_from_menu = !listItem.visible && !listItem.hidden_by_user;
    //            isToCheckIt = listItem.dinm_dd_toCcheck?? !listItem.hidden_by_user?? 1;
    //        }else if(ops.calling_for === "name_datalist"){
    //            isToCheckIt = 0
    //        } else {
    //            data_hidden_from_menu = !listItem.visible;
    //            isToCheckIt = listItem.dinm_dd_toCcheck?? 1;
    //        }
    //
    //        $(chBox_el).attr('data-hidden-from-menu', data_hidden_from_menu);
    //        if(ops.calling_for === "masterSearch"){
    //            $(chBox_el).attr('data-hidden-by-col_view', data_hidden_from_menu);
    //        }
    //
    //
    //        let _id = `el_${ii++}_${performance.now().toString().replace('.', '_')}`; // only number as id is not good and '.' can not be part of the id string
    ////        let isToCheckIt = listItem.dinm_dd_toCcheck?? !listItem.hidden_by_user?? 1;
    ////        $("input", chBox_el).attr({"id": _id, "value": `${listItem?.[ops.dd_select_list.dVal]}`}).prop("checked", listItem.dinm_dd_toCcheck?? 1);
    //        $("input", chBox_el).attr({"id": _id, "value": `${listItem?.[ops.dd_select_list.dVal]}`}).prop("checked", isToCheckIt);
    //        $("label", chBox_el).attr({"for": _id}).empty().append(`${listItem?.[ops.dd_select_list.dTxt]}`);
    //        $(".dds_itemsList_w", selDD_el).append(chBox_el);
    //    });
    //
    //    if($.inArray(ops.calling_for,["masterSearch", "colsVisibility"]) !== -1){
    //        set_selectAll_indicators({target: "test"});
    //    }
    //#endregion
    // </editor-fold>

    $('.dds_itemsList_w input', selDD_el).change(function (e) {
        iConsole('dds_itemsList_w input', selDD_el);
        ops.fn_onInptChkChange?.(e, ops);

        if (ops.calling_for === 'name_datalist') {
            // put the value as a .val() of the calling input element
            // close the drop down

            // putting it in settimeout to work this
            setTimeout(() => {
                $(e.target).prop('checked', 0);
                iBS_hideAll_Dropdowns();
            });
        }

        set_selectAll_indicators(e);

        const dropdownToggle = $('.iDDselnWfilter_btn', $(selDD_el));
        if (dropdownToggle.length != 0) {
            bootstrap.Dropdown.getInstance(dropdownToggle)?.show();
        }
    });
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
    //#region -Nested table(s)
    /*
    <div class="btn-group dropup">
<button type="button" class="btn btn-secondary">
Split dropup
</button>
<button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
<span class="visually-hidden">Toggle Dropdown</span>
</button>
<ul class="dropdown-menu">
<!-- Dropdown menu links -->
</ul>
</div>*/
    /*
                    <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                    <label class="form-check-label" for="flexCheckDefault">
                      Default checkbox
                    </label>
                  </div>

                  <button type="button" class="btn btn-primary">Primary</button>
                  <button type="button" class="btn btn-outline-primary">Primary</button>
                  */
    //#endregion
    // </editor-fold>
    return selDD_el;
}
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fn: iConsole ">
//#region -fn: iConsole
function iConsole(...content) {
    if (CONSOLE_ON) {
        // Create an Error object to extract the stack trace
        const error = new Error();
        const stackLines = error.stack.split('\n');

        // Firefox-specific adjustment: Typically, the calling function is at index 3
        const callerLine = stackLines[2].trim();

        // Use iConsole.apply to maintain the calling context
        //      Function.prototype.apply.call(iConsole, console, [...content]);
        // Optionally log the caller line separately if needed
        //         console.log('Called from:', callerLine); // Use this line if you want to explicitly log the caller
    }
}
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fns: extenthion to Bootstrap: hide all popovers, dropdowns ">
//#region -fn: iConsole
// +i+ will not hide if the calling element has attribute data-bypassTr="1"
function iBS_hideAll_Popovers() {
    $.each($('.popover.show'), function () {
        const popoverToggle = $(`[aria-describedby=${$(this).attr('id')}]`);
        if (popoverToggle.is('[data-bypassTr]')) {
            // no working   if(popoverToggle.hasAttr("[data-bypassTr]")){
            return true;
        }
        if (popoverToggle.length > 0) {
            bootstrap.Popover.getInstance(popoverToggle).hide();
        }
    });
}
function iBS_hideAll_Dropdowns() {
    $.each($('.dropdown-menu.show'), function () {
        const dropdownToggle = $(`#${$(this).attr('data-for_seldd_id')}`);
        if (dropdownToggle.length > 0) {
            bootstrap.Dropdown.getInstance(dropdownToggle).hide();
        }
    });
}
//#endregion
// </editor-fold>

function iTr_listen_resize(row) {
    $(window).resize(() => {
        $('.table-container', row.getElement()).attr(
            'style',
            `width: ${$(row.getElement()).closest('.tabulator-tableholder').width() - 22}px`
        );
    });
}

var i_el_cc = {
    'none-selected': 'none-selected    far fa-square       text-primary ',
    'all-selected': 'all-selected     far fa-times-square text-danger ',
    'partial-selected': 'partial-selected far fa-expand       text-dark',
};

if (_TESTING_NB) {
    i_el_cc = {
        'none-selected': 'none-selected fa fa-square text-primary',
        'all-selected': 'all-selected fa fa-times-square text-danger',
        'partial-selected': 'partial-selected fa fa-expand text-dark',
    };
}

function filter_tblData(CustomTabulator, dd_el, col_name) {
    let filters = CustomTabulator.TabulatorObj?.getFilters()[0] || [];

    $('input.form-check-input:checked', dd_el).each(function () {
        filters.push({ field: col_name, type: '=', value: $(this).val() });
    });
    let data = $.extend(true, settings_data, {});

    filters.forEach((filter) => {
        data = data.filter((item) => {
            return isMatched(item, filter);
        });
    });

    function isMatched(obj, filter) {
        return obj[filter.field] == filter.value;
    }

    CustomTabulator.TabulatorObj.replaceData(data);
    CustomTabulator.TabulatorObj.setFilter([filters]);
    // filters.forEach((filter)=>{
    //     data = data.filter((item)=>{
    //         return item[filter.field] == filter.value
    //     })
    //     console.log({data})
    // })
    // console.log({filters, data})
}

// <editor-fold defaultstate="collapsed" desc=" fn: debounce ">
//#region - fn: debounce
function debounce(fn, fn_d) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, fn_d);
    };
}
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fn: createDropdownForTable ">
//#region - fn: createDropdownForTable
function createDropdownForTable(ops = {}, iTr_data = []) {
    // +i+ this is the dd option list use it: iTr_headerFilter_by_ddFilter: {type: 'multi-checkbox', iTr_dropdown_ops: {dd_select_list: {width:400}}},
    let def = {
        dd_el_w: {
            class: null,
            style: null,
            //             icon: {class: null, style: null}, alt_el: null
        }, // The button we click to activate the dropdown
        dd_moveToBody: true,
        // dd_calling_btn: { class: null, style: null, text: null, title: null, width: 250, reseizable: true, clearable: false, resetText: '-' },
        dd_calling_btn: {
            class: null,
            style: null,
            text: null,
            title: null,
            width: 250,
            reseizable: true,
            clearable: { doIT: false, resetText: '-', class: null, style: 'width: 30px;' },
        },
        dd_select_list: {
            id: null,
            autoFocus: true,
            alwaysShow: false,
            defaultSelected: false,
            deselectAll: true,
            class: null,
            style: null,
            width: null,
        }, // width: [null || dd_calling_btn.width | number]
        iTr_data: { ajaxURL: null, class_name: null }, // data may contain [class_name] property in order to customize the view of each row of data
        iTr_cellDblClick: false,
        iTr_initTblOnStart: false, //It must be true in the case of DD, which can add data. It will help with clearing the data button
        iTr_field_name: '',
        // iTr_table_index: This is the Tabulator's unique record value. Most of the time, it will be simply the field we are showing on the table. We take care to assign its value in the code. But we also can add a field to the data with an id number and set here the field name (mostly it will be "id")
        iTr_table_index: null,
        iTr_height: 350,
        iTr_minHeight: null,
        iTr_width: null, // [null || dd_calling_btn.width | number]
        iTr_dd_title: null,
        iTR_filter: [],
        tooltip: null,
        reactiveData: false, // we use true in order that changes will be reflected in the dd tabulator
        // BUT this can SLOW the PC in case of add a new rec, Undo and repeating it a few times
        iTr_field_headerSearchPlaceHolder: 'Search',
        iTr_header_filter: { class: 'ps-1' },
        iTr_cell: { class: 'f_p10h45', style: null, scrollerW: 20 }, // class:[f_p10h45 | f_p2h30]
        iTr_field: { class: null, style: null }, // in case we want to have border: '1px solid rgba(0, 0, 0, 0.2)',
        iTr_ddList: { type: 'button', css: 'margin-right: 5px' }, // [ button | multi-checkbox | checkbox ]
        iTr_add_tableOptions: {},
        fn_onDropdownClick: null, // Here we can customize the click functionality of the dropdown
        fn_beforeDropdownShow: null,
        fn_beforeTableShow: null,
        shouldRefresh: false,
        closeOtherDropdown: true,
        setText_byValue: null,
    };
    ops = $.extend(true, def, ops);
    ops.iTr_table_index = ops.iTr_table_index ?? ops.iTr_field_name;
    // <editor-fold defaultstate="collapsed" desc=" fn: customHeaderFilter (Give the ability to filter also inside the Tabulator nested data trees = the build in tree structure) ">
    //#region -fn: customHeaderFilter
    function customHeaderFilter(headerValue, rowValue, rowData, filterParams) {
        const parentValue = (rowData[filterParams?.filterKey] || '').toLowerCase();
        const searchValue = headerValue?.toLowerCase();
        let currentItem = $dd_select_list.filter('[data-current="true"]');
        if (currentItem.length) {
            currentItem.removeAttr('data-current');
        }
        function isValueExistInChildred(_children) {
            if (!_children) {
                return false;
            }
            return !!_children?.find((data) => (data?.[filterParams?.filterKey] || '').toLowerCase().includes(searchValue));
        }
        return parentValue.includes(searchValue) || isValueExistInChildred(rowData?._children); //must return a boolean, true if it passes the filter.
    }

    // <editor-fold defaultstate="collapsed" desc=" fn: custom header filter input elements ">
    function customHeaderFilterInput(cell, onRendered, success, cancel) {
        // Create input element
        let input = $(
            `<input type="text" class="tabulatorDropdownCustomInput form-control form-control-sm ${
                ops?.fn_addData ? '' : 'mt-1 mb-1'
            }" placeholder="${ops.iTr_field_headerSearchPlaceHolder}" autofocus />`
        );
        // Set default value if filter exists
        input.val(cell.getValue());
        input.on('change', () => success(input.val()));
        input.on('blur', () => cancel());

        onRendered(function () {
            const container = input.closest('.tabulator-col-content');
            if (ops?.fn_addData) {
                const headerFilter = input.parent().addClass('input-group mt-1 mb-1');
                const icon =
                    //                    $(`<span class="input-group-text" title="Use enter or click here to add new value" style="font-size: 14px;padding: 5px 5px 5px  23px;">
                    //                    <span class="pe-1" style="font-size: 25px;position: fixed; right: 72px;top: 10px;">&#x2936;</span>Enter</span>`)

                    $(`<span class="input-group-text" title="Use Enter or click here to add a new value" style="font-size: 14px; padding: 5px 5px 5px 23px; position: relative;">
  <span style="font-size: 20px; position: absolute; left: 9px; top: 57%; transform: translateY(-50%);">&#x2936;</span>
  Enter
</span>`).click((e) => {
                        if (input.val()) {
                            ops.fn_addData(input.val(), tableInstance?.getSelectedRows(), tableInstance, $dd_el_w);
                        }
                    });
                input.on('keydown', (e) => {
                    console.log('e', e);
                    if (['Enter', 'NumpadEnter'].includes(e.code)) {
                        icon.click();
                    }
                });
                headerFilter.append(icon);
            }
            input.parent().css({
                width: 'calc(100% - 4px)',
            });
            if (container.length && ops.iTr_ddList.type === 'multi-checkbox' && ops.dd_select_list.deselectAll) {
                container.append($selectAllEl_W).css({
                    padding: '5px 0px 0px 10px',
                });
            }
        });
        // Append input element
        return input.get(0);
    }
    // </editor-fold>
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" dropdown control elements  (the wrapper el | calling button | dd list (ul)) ">
    //#region - columns
    let $dd_el_w = $('<div class="dd_filter_byTr_callingEl dropdown btn-group" role="group">')
        .toggleClass(ops.dd_el_w.class)
        .attr('style', ops.dd_el_w.style);

    let $dd_calling_btn = $(
        `<button class="dropdownMenuButton ddMBtn_F_01 dropdown-toggle position-relative text-nowrap-elpsis rounded-1" data-bs-toggle="dropdown"  
            ${ops.dd_select_list.alwaysShow ? 'data-bs-auto-close="inside"' : ''} __title="${ops.dd_calling_btn.title}" type="button" >`
    )
        .toggleClass(ops.dd_calling_btn.class)
        .attr({ style: ops.dd_calling_btn.style, tbl_id: ops.dd_select_list.id })
        .width(ops.dd_calling_btn.width);
    $dd_calling_btn.append(ops.dd_calling_btn.text);

    const clearData = $(
        `<button class="form-control form-control-sm py-1"><i class="${_DEV_i ?? 'far'} fa-trash text-danger" type="button"></i></button>`
    )
        .toggleClass(ops.dd_calling_btn.clearable.class)
        .attr({ style: ops.dd_calling_btn.clearable.style })
        .click((e) => {
            e.stopPropagation();
            if (tableInstance) {
                tableInstance.addRow({ [ops.iTr_field_name]: null }).then(async function (row) {
                    if (ops.fn_onDropdownClick) {
                        ops.fn_onDropdownClick(row, [row], tableInstance, $dd_el_w);
                        if (row.getElement()) {
                            await row.delete();
                        }
                        $dd_calling_btn.empty().append(ops.dd_calling_btn.clearable.resetText);
                    }
                });
            }
        });

    // Create the dropdown menu UL element
    var $dd_select_list = $(
        `<ul id="${ops.dd_select_list.id}" class="w-auto ddF_byTr_F_01 z-index-1001 dds_itemsList_w tabulator-dd dropdown-menu bg-white p-0">`
    )
        .toggleClass(ops.dd_select_list.class)
        .attr('style', ops.dd_select_list.style)
        .width(ops.dd_select_list.width || ops.dd_calling_btn.width);
    // Append the button and menu to the dropdown div

    $dd_el_w.append($dd_calling_btn, $dd_select_list);
    if (ops.dd_calling_btn.clearable.doIT) {
        $dd_el_w.append(clearData);
    }
    //#endregion
    // </editor-fold>

    // select all element label from drodpdown
    const $selectAll_labelEl = $('<label class="form-check-label"></label>').text('Select All');

    // select all element wrapper
    const $selectAllEl_W = $(`<div class='form-check py-0'><input class='dd_check form-check-input' type='checkbox' /></div>`)
        .append($selectAll_labelEl)
        .on('click', (e) => {
            e.stopPropagation();
            if ($selectAll_labelEl.text() === 'Select All') {
                tableInstance.selectRow('active');
            } else {
                tableInstance.deselectRow(); // Deselect all rows
            }
            updateSelectAllVisibility();
            if (ops.fn_onDropdownClick) {
                ops.fn_onDropdownClick(null, tableInstance?.getSelectedRows(), tableInstance, $dd_el_w);
            }
        });

    // <editor-fold defaultstate="collapsed" desc=" fn: observeWidthChange ">
    //#region -fn: observeWidthChange
    // function observeWidthChange($dd_el_w, callback) {
    //     const element = $dd_el_w.get(0); // Get the native DOM element
    //     if (!element) return;

    //     const resizeObserver = new ResizeObserver((entries) => {
    //         for (let entry of entries) {
    //             if (entry.contentBoxSize) {
    //                 const newWidth = entry.contentRect.width;
    //                 callback(newWidth < 165 ? 165 : newWidth);
    //             }
    //         }
    //     });

    //     resizeObserver.observe(element);

    //     // Return a function to disconnect the observer if needed
    //     return () => resizeObserver.disconnect();
    // }
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" COMMENT: fn: updateColumnWidth ">
    //#region -fn: updateColumnWidth
    // function updateColumnWidth(newWidth) {
    //     if (tableInstance && tableInstance.getColumn(ops.iTr_field_name).getWidth() != newWidth) {
    //         const tableContainaer = $(`#${ops.dd_select_list.id} .tabulator-tableholder`);
    //         const tableheader = $(`#${ops.dd_select_list.id} .tabulator-header`);
    //         const table = $('.tabulator-table', tableContainaer);

    //         let isScrollBar = true;
    //         if (tableContainaer.length && table.length && table.height() <= tableContainaer.height()) {
    //             isScrollBar = false;
    //             //                adjustDropdownHeight();
    //         }
    //         //            else if (ops.iTr_minHeight && table.height()+ tableheader.height() < ops.iTr_minHeight) {
    //         //                adjustDropdownHeight();
    //         //            }
    //         $dd_select_list.width(newWidth - 2);
    //         tableInstance.updateColumnDefinition(ops.iTr_field_name, { width: isScrollBar ? newWidth - ops.iTr_cell.scrollerW : newWidth });
    //         const $column_el = $(`.tabulator-col`, tableheader);
    //         if (ops.iTr_ddList.type === 'multi-checkbox' && ops.dd_select_list.deselectAll) {
    //             $column_el.width(newWidth - 12);
    //         } else {
    //             $column_el.width(newWidth);
    //         }
    //     }
    // }
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" fn: adjustDropdownHeight ">
    //#region -fn: adjustDropdownHeight
    function adjustDropdownHeight() {
        const tableElement = $(tableInstance?.element);
        const tableheader = $('.tabulator-header', tableElement);
        let tableContentHeight = $('.tabulator-table', tableElement).height();
        let tableheaderHeight = $('.tabulator-headers', tableElement).height();
        if (tableElement.length && tableContentHeight - 10 < ops.iTr_height - tableheaderHeight) {
            if (tableInstance.getDataCount('visible') === tableInstance.getDataCount()) {
                tableContentHeight += 10;
            }
            tableContentHeight = tableContentHeight < 62 ? 62 : tableContentHeight;
            tableInstance.setHeight(tableContentHeight + tableheaderHeight + 10);
            tableheader.height(tableheaderHeight + 2);
        } else {
            tableInstance.setHeight(ops.iTr_height);
            tableheader.height(tableheaderHeight + 2);
        }
        ops.tableBuilt = true;
    }
    //#endregion
    // </editor-fold>

    // const debouncedUpdateColumnWidth = debounce(updateColumnWidth, 200);

    // <editor-fold defaultstate="collapsed" desc=" fn: updateSelectAllVisibility ">
    //#region -fn: updateSelectAllVisibility
    function updateSelectAllVisibility() {
        const selectedRows = tableInstance.getSelectedRows().length;
        const totalRows = tableInstance.getData().length;
        if (selectedRows === 0) {
            $('input', $selectAllEl_W).prop({ checked: 0, indeterminate: 0 });
            $selectAll_labelEl.text('Select All');
        } else if (selectedRows === totalRows) {
            $('input', $selectAllEl_W).prop({ checked: 1, indeterminate: 0 });
            $selectAll_labelEl.text('Deselect all');
        } else {
            $('input', $selectAllEl_W).prop('indeterminate', 1);
            $selectAll_labelEl.text('Deselect all');
        }
    }
    //#endregion
    // </editor-fold>

    const handleClick = function (e) {
        if (!$dd_calling_btn.is(':visible')) {
            $dd_select_list.removeClass('show');
        }
    };

    let tableInstance;
    // <editor-fold defaultstate="collapsed" desc=" on dropdown: show.bs.dropdown. Here all the dropdown functions ">
    //#region - on dropdown: show.bs.dropdown
    $dd_el_w.on('show.bs.dropdown', initTable);

    function initTable() {
        if (!tableInstance) {
            const options = {
                // this is a list of a Tabulator options that we set
                rowHeight: 30,
                // <editor-fold defaultstate="collapsed" desc=" basic Tabulator options ">
                //#region - basic Tabulator options
                virtualDom: true,
                reactiveData: ops.reactiveData, // we need this to reflect changes in case of dd search or columns view from the tabulator tools
                dataLoaderLoading: "<div class='loader'>Loading Data</div>",
                data: ops?.iTr_add_tableOptions?.ajaxURL ? undefined : iTr_data,
                dataTree: true,
                dataTreeChildField: '_children',
                renderVerticalBuffer: ops.iTr_height + 1000, // to make the DD's scroll smoother
                dataTreeStartExpanded: true,
                layout: 'fitData', // a change here might cause that we will nt be able to change the dd width
                height: ops.iTr_height,
                initialFilter: ops.iTR_filter,
                index: ops?.iTr_table_index,
                // initialSort: [ { column: ops.iTr_field_name, dir: "asc" } ],
                //#endregion
                // </editor-fold>
                // <editor-fold defaultstate="collapsed" desc=" columns ">
                //#region - columns
                columns: [
                    {
                        field: ops.iTr_field_name,
                        title: ops.iTr_dd_title,
                        resizable: ops.dd_calling_btn.reseizable,
                        tooltip: ops.tooltip ?? false, // can be [true | false | or fn ]  we control it bty adding: iTr_dropdown_ops:{tooltip: true,}
                        width: (ops.dd_select_list.width || ops.dd_calling_btn.width) - ops.iTr_cell.scrollerW,
                        minWidth: 165,
                        headerSort: false,
                        titleFormatter: (cell) => {
                            return cell.getValue().replace('&nbsp;', '') ? cell.getValue() : null;
                        },
                        headerFilter: customHeaderFilterInput,
                        headerFilterPlaceholder: ops.iTr_field_headerSearchPlaceHolder,
                        headerFilterFunc: customHeaderFilter,
                        headerFilterFuncParams: { filterKey: ops.iTr_field_name },
                        formatter: (cell) => {
                            if (ops.setText_byValue) {
                                return ops.setText_byValue(cell);
                            }
                            return cell.getValue();
                        },
                    },
                ],
                //#endregion
                // </editor-fold>
                // <editor-fold defaultstate="collapsed" desc=" rowFormatter ">
                //#region - rowFormatter
                rowFormatter: function (row) {
                    let $cell = $('.tabulator-cell', row.getElement());
                    $('.dd_check', $cell).remove();
                    if (ops.iTr_ddList.type !== 'button') {
                        const checkbox = $("<input class='dd_check form-check-input mt-1' type='checkbox' />")
                            .attr('style', ops.iTr_ddList.css)
                            .prop('checked', row.isSelected())
                            .on('click', function (e) {
                                checkbox.prop('checked', row.isSelected());
                            });
                        $cell.addClass('tbl_dd_chk_opt').prepend(checkbox);
                    } else {
                        $cell.addClass('tbl_dd_btn_opt');
                    }
                    //                    $cell.attr('title', row.getData()[ops.iTr_field_name]);
                    $cell.addClass(ops.iTr_cell.class);

                    // this will allow us to add a class to eacg row's dataa
                    if (ops.iTr_data.class_name && row?.getData?.()?.[ops.iTr_data.class_name]) {
                        $(row.getElement()).addClass(row.getData()[ops.iTr_data.class_name]);
                    }
                },

                //#endregion
                // </editor-fold>

                ...ops.iTr_add_tableOptions,
            };
            // Only create the table if it doesn't already exist
            tableInstance = new Tabulator(`#${ops.dd_select_list.id}`, options);
            // <editor-fold defaultstate="collapsed" desc=" on tabulator: row click ">
            //#region - on tabulator: row click
            tableInstance?.on('rowClick', function (e, row) {
                e.stopPropagation();
                row.toggleSelect();
                if (ops.iTr_ddList.type === 'button' || ops.iTr_ddList.type === 'checkbox') {
                    tableInstance.getSelectedRows().forEach((srow) => {
                        if (row.getData()[ops.iTr_table_index] !== srow.getData()[ops.iTr_table_index]) {
                            srow.deselect();
                        }
                    });
                    if (!ops.dd_select_list.alwaysShow) {
                        bootstrap.Dropdown.getInstance($dd_calling_btn)?.hide();
                    }
                }
                if (ops.fn_onDropdownClick) {
                    // Here we can customize the click functionality of the dropdown
                    ops.fn_onDropdownClick(row, tableInstance?.getSelectedRows(), tableInstance, $dd_el_w);
                }
                if (ops.iTr_ddList.type === 'multi-checkbox' && ops.dd_select_list.deselectAll) {
                    updateSelectAllVisibility();
                }
                $dd_calling_btn.removeClass('is-invalid');
            });
            tableInstance.on('groupClick', function (e, group) {
                //e - the click event object
                //group - group component
                e.stopPropagation();
                group.toggle();
            });

            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" on tabulator: row click ">
            //#region - on tabulator: row click
            tableInstance.on('rowSelected', function (row) {
                if ($('.dd_check', row.getElement()).length) {
                    $('.dd_check', row.getElement()).prop('checked', true);
                }
            });
            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" on tabulator: row dblClick ">
            //#region - on tabulator: row click
            // we do as it is a row click but we click also the dd calling btn - this makes teh apply filter
            if (ops.iTr_cellDblClick) {
                tableInstance.on('rowDblClick', function (e, row) {
                    row.select();
                    if (ops.fn_onDropdownClick) {
                        ops.fn_onDropdownClick(row, tableInstance?.getSelectedRows(), tableInstance, $dd_el_w);
                    }
                    $dd_calling_btn.click();
                    bootstrap.Dropdown.getInstance($dd_calling_btn)?.hide();
                });
            }
            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" on tabulator: row deselected ">
            //#region - on tabulator: row click
            tableInstance.on('rowDeselected', function (row) {
                if ($('.dd_check', row.getElement()).length) {
                    $('.dd_check', row.getElement()).prop('checked', false);
                }
            });
            //#endregion
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc=" on tabulator: tableBuilt ">
            //#region - on tabulator: tableBuilt
            tableInstance.on('tableBuilt', () => {
                $('.tabulator-header-filter', $dd_select_list).toggleClass(ops.iTr_header_filter.class);
                if (ops.dd_select_list.autoFocus) {
                    $('.tabulator-header-filter input', $dd_select_list).focus();
                }
                $(`#${ops.dd_select_list.id} .tabulator-tableholder`).css({
                    'overflow-y': 'scroll',
                    'overflow-x': 'hidden',
                });
                $(`#${ops.dd_select_list.id} .tabulator-col-title`);
                const columTitle = $(`#${ops.dd_select_list.id} .tabulator-col-title`);
                const tableHeader = $(`#${ops.dd_select_list.id} .tabulator-header`);
                const $column_el = $(`.tabulator-col`, tableHeader);
                $column_el.width($('.tabulator-header-contents', $dd_select_list).width() - 5);
                $('.tabulator-header-filter', tableHeader).addClass('mt-1');
                const colInput = $('input', '.tabulator-header-filter', tableHeader);
                if (columTitle.length && tableHeader.length && $.trim(columTitle.text()) === '') {
                    columTitle.remove();
                    let headerHeight = ('.tabulator-header-contents', tableHeader).height();
                    tableHeader.height(headerHeight);
                } else {
                    tableHeader.height(tableHeader.height() + 2);
                }
                adjustDropdownHeight();
                // if (ops.dd_calling_btn.reseizable) {
                //     observeWidthChange($dd_calling_btn, debouncedUpdateColumnWidth);
                // } else {
                //     updateColumnWidth(ops.dd_select_list.width || ops.dd_calling_btn.width);
                // }
                if (ops.iTr_ddList.type === 'multi-checkbox' && ops.dd_select_list.defaultSelected) {
                    tableInstance.selectRow();
                    updateSelectAllVisibility();
                }
            });
            //#endregion
            // </editor-fold>
        } else if (ops.shouldRefresh) {
            //+IR+ what is this and why?
            tableInstance.setData(ops.iTr_data.ajaxURL || iTr_data);
        }
        window.dropdownInstance = { ops, tableInstance }; // +IR+ Sibi  for what is it? can we rename to iTr_dropdownInstance
        updateSelectAllVisibility();
        if (ops.fn_beforeDropdownShow) {
            ops.fn_beforeDropdownShow($dd_el_w, tableInstance);
        }
        if (ops.dd_moveToBody) {
            $(document).on('click', handleClick);
            $('ul.dropdown-menu', $dd_el_w).addClass('moved_ddown_to_body').appendTo('body');
        }
        if (ops.closeOtherDropdown) {
            // Clear selected rows in other dropdowns with active tables
            $('.tabulator-dd').each(function () {
                const otherDropdownId = $(this).attr('id');
                if (otherDropdownId !== ops.dd_select_list.id) {
                    const dropdownInstance = $(`#${otherDropdownId}`, $(this).parent());
                    if (dropdownInstance.length) {
                        dropdownInstance.removeClass('show');
                    }
                }
            });
        }
        setTimeout(() => {
            tableInstance?.getRows('active')[0]?.scrollTo();
            if (ops.dd_select_list.autoFocus) {
                $('.tabulator-header-filter input', $dd_select_list).val('').change().focus();
            }
            if (ops.tableBuilt) {
                adjustDropdownHeight();
            }
        }, 100);
    }

    $dd_el_w.on('hide.bs.dropdown', function () {
        if (ops.dd_moveToBody) {
            $(document).off('click', handleClick);
        }
    });

    $dd_calling_btn.ready(() => {
        if (ops.iTr_initTblOnStart) {
            let dropdown = new bootstrap.Dropdown($dd_calling_btn[0]);
            dropdown.show();
            dropdown.hide();
        }
    });

    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" on dropdown: key navigation ">
    //#region - on dropdown: key navigation
    $dd_select_list.on('keydown', function (e) {
        const items = $dd_select_list.find('.tabulator-row');
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            let currentItem = items.filter('[data-current="true"]');
            let nextItem;

            if (e.key === 'ArrowDown') {
                nextItem = currentItem.length ? currentItem.next() : items.first();
            } else if (e.key === 'ArrowUp') {
                nextItem = currentItem.length ? currentItem.prev() : items.last();
            }

            if (nextItem && nextItem.length) {
                // Remove the data attribute from the previously hovered item
                currentItem.removeAttr('data-current');

                // Apply the hover effect to the new item, set the data attribute, and scroll into view
                nextItem.attr('data-current', 'true');
                nextItem.get(0).scrollIntoView({ block: 'nearest', inline: 'nearest' });
            }
        } else if (e.key === 'Enter') {
            let currentItem = items.filter('[data-current="true"]');
            if (currentItem?.length) {
                currentItem.click();
            }
        } else if ($(e.target).closest('.tabulator-header-filter')?.length) {
            let currentItem = items.filter('[data-current="true"]');
            currentItem.removeAttr('data-current');
        }
    });
    //#endregion
    // </editor-fold>

    // $('.tbl_single_select_w').on('click', function (e) {
    //     if (!$dd_calling_btn.is(':visible')) {
    //         $dd_select_list.removeClass('show');
    //     }
    // });

    function getTableInstance() {
        return tableInstance;
    }

    $dd_select_list.ready(() => {
        if (ops.dd_select_list.alwaysShow) {
            bootstrap.Dropdown.getOrCreateInstance($dd_calling_btn).show();
        }
        // Your additional code here
    });

    // Append the dropdown div to the body or desired container
    return { dropdown: $dd_el_w, getTableInstance, options: ops };
}
//#endregion
// </editor-fold>

// This function should give you width of scrollbar

function getScrollbarWidth() {
    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
}

function get_Tabulator_byEl($this) {
    /*
     * To use it you must add this to appy fcell formater
     * 
            let $row_el = $(cell.getRow().getElement());
            $row_el.attr({"data-trRid": row_data["id"]}); 
     */

    const $call_el = $this.closest('.popover').length ? $(`[aria-describedby="${$this.closest('.popover').prop('id')}"]`) : $this;
    const $call_row = $call_el.closest('.tabulator-row');
    const call_Tr_id = $call_row.closest('.tabulator').attr('id');
    const trObj = Tabulator.findTable(`#${call_Tr_id}`)[0];
    const rowObj = trObj.getRow($call_row.attr('data-trRid'));
    const row_data = rowObj.getData();

    const cellFname = $call_el.closest('.tabulator-cell').attr('tabulator-field');
    const cellObj = rowObj.getCell(cellFname);

    return { obj: trObj, rowObj, row_data, cellObj, $call_el };
}

// <editor-fold defaultstate="collapsed" desc=" COMMENT ">
//#region -COMMENT

// <editor-fold defaultstate="collapsed" desc=" Loader ">
//class _iGU_AJAX_loader_iTr{
//    /*
//     * Use this attributes to cutumize the loader element:
//     *      - ldr_class to add a class
//     *      - attrToCss to set the css of the element using _iGUutls.attr_to_css function
//     * Using the _iGUAJAX_loader.show_loader() and you do not see the loader?
//     * 1. change the delay to 0. (in the calling to insi. the class)
//     * 2. call to the show_loader() first and then, put all the JS "havy code" inside setTimeout(function(){ code... }, 50);
//     */
//    constructor(a){
//        let defaults = {    // do NOT include keyword var ;  you want to access defaults inside the $.each()
//            "l_el" : __AGS__ || "<span class='skiptranslate text-nowrap'><span>Loading...</span></span>",
//            "delay": 700,
//            "c"    : null, // class toggle
//            "css"  : {},
//            "zInx" : true
//        };
//        this.a = $.extend(true, {}, defaults, a);
//
//        let l_el = __isOEM__? $(__ARG_main__) : $(this["a"]["l_el"]);
//
//        if(!__isOEM__) {
//            $(".airgusEl", l_el).addClass("bg-logo-bg html_AGS_logo_col px-3").css({"font-size": "4rem"});
//            this["a"]["l_el"] = $(l_el).prop("outerHTML")
//+`<div class="extrText">No camera left behind<i class="far fa-registered h7 position-relative" style="left:2px; top:-10px"></i></div>`;
//        } else {
//            $(l_el).addClass(`bg-logo-bg ${$(l_el).attr("ldr_class")}`);
//            _iGUutls.attr_to_css($(l_el));
//            this["a"]["l_el"] = $(l_el).prop("outerHTML");
//        }
//
//        // <div class="loader _NOneed___html_AGS_logo_col"><span class="align-content-around">${this["a"]["l_el"]}</span></div>
//        let laoderEl =
//            `<div id="AJAX_load" class="fixed-top h-100 w-100 d-flex justify-content-center align-items-center align-items-xl-baseline" style="background-color:#03030385; z-index: 1000;">
//            <div class="row align-items-center justify-content-center h-75">
//                <div class="loader"><span class="align-content-around">${this["a"]["l_el"]}</span></div>
//            </div>
//            </div>`;
//        this.laoderEl = laoderEl;
//        // $("body").append(laoderEl);
//
//        this.set_zIndex();
//        this.setAjaxLoaderDelay(this["a"]["delay"]);
//
//        this.events();
//    }
//
//    events(){
//        $(document).on({
//            ajaxStart: function() {
//                localStorage.setItem("ajax", "started");
//                setTimeout(function(){
//                    if(localStorage.getItem("ajax") !== "stop"){
//                        $("#AJAX_load").removeClass("d-none");
//                    }
//                }, parseInt(localStorage.getItem("timeout_val")) || 0);
//            },
//            ajaxStop : function() {
//                localStorage.setItem("ajax", "stop");
//                $("#AJAX_load").addClass("d-none");
//            }
//        });
//    }
//
//    setAjaxLoaderDelay(delay_amt){
//        localStorage.setItem("timeout_val", delay_amt);
//    }
//
//    toActivate(aa){
//        let dd = {
//            "toOn"   : 1,
//            "delyMs" : 0,
//            "c"      : null,
//            "css"    : {}
//        };
//        aa = $.extend(true, {}, dd, aa);
//
//        setTimeout(function(){
//            $(".AJAX_modal").toggleClass(aa["c"]).css(aa["css"]);
//            if(aa["toOn"] === 1){
//                $("#AJAX_load").removeClass("d-none");
//            } else if(aa["toOn"] === 0){
//                $("#AJAX_load").addClass("d-none");
//            }
//        }, aa["delayMs"]);
//    }
//
//    set_zIndex(){
//        if(this["a"]["zInx"]){
////            let _iGUutls = new _iGU_utls();
//            let zInd = 1000000;  //_iGUutls.get_maxZindex() + 1;
//            $("#AJAX_load").css({"z-index": zInd});
//        }
//    }
//
//    show_loader(){
//        if(this["a"]["zInx"]){
////            let _iGUutls = new _iGU_utls();
//            let zInd = 100000; //_iGUutls.get_maxZindex() + 1;
//            $("#AJAX_load").css({"z-index": zInd});
//        }
//        localStorage.setItem("ajax", "started");
//        setTimeout(function(){
//            if(localStorage.getItem("ajax") !== "stop"){
//                $("#AJAX_load").removeClass("d-none");
//            }
//        }, parseInt(localStorage.getItem("timeout_val")) || 0);
//    }
//
//    hide_loader(){
//        localStorage.setItem("ajax", "stop");
//        $("#AJAX_load").addClass("d-none");
//    }
//}

// function filter_tblData(CustomTabulator, dd_el, col_name){
//     let filters = CustomTabulator.TabulatorObj?.getFilters()[0] || [];
//     let val_arr = []
//     $("input.form-check-input:checked" ,dd_el).each(function(){
//             filters.push({field: col_name, type:"=", value:$(this).val()});
//             val_arr.push($(this).val());
//     });
//     console.log({filters})
//     if(val_arr.length > 0){
//         let data = $.extend(true,CustomTabulator.currentPageData,{})
//         data = data.filter((item)=>{
//             return val_arr.includes(item[col_name])
//         })
//         CustomTabulator.TabulatorObj.replaceData(data);
//         CustomTabulator.TabulatorObj.setFilter([filters]);
//     }
//     // filters.forEach((filter)=>{
//     //     data = data.filter((item)=>{
//     //         return item[filter.field] == filter.value
//     //     })
//     //     console.log({data})
//     // })
//     // console.log({filters, data})

//     // // manually filter the data
//     // if(value){
//     //     const filter_tbl_data = CustomTabulator.currentPageData.filter((row)=>{
//     //         if(row[col_name] == value){
//     //             return true;
//     //         }
//     //     });
//     //     CustomTabulator.TabulatorObj.replaceData(filter_tbl_data);
//     // }
//     // CustomTabulator.TabulatorObj.setFilter([filters]);
// }

// function filter_tblData(CustomTabulator, dd_el, col_name){
//     let value;
//     let filters = CustomTabulator.TabulatorObj?.getFilters()[0] || [];
//     $("input.form-check-input:checked" ,dd_el).each(function(){
//         if(!value){
//             filters.push({field: col_name, type:"=", value:$(this).val()});
//             value = $(this).val();
//         }
//     });

//     // manually filter the data
//     if(value){
//         const filter_tbl_data = CustomTabulator.currentPageData.filter((row)=>{
//             if(row[col_name] == value){
//                 return true;
//             }
//         });
//         CustomTabulator.TabulatorObj.replaceData(filter_tbl_data);
//         CustomTabulator.TabulatorObj.setFilter([filters]);
//     }
// }

// function selectRowsAndCheckInput(_this){
//     let rows_to_select = [];
//     // let disable_present = false

//     if(_this.filtered_tbl_data.length > 0){
//         rows_to_select = _this.filtered_tbl_data
//     } else {
//         rows_to_select = _this.TabulatorObj.getRows()
//     }

//     if(rows_to_select.length == 0) {
//         return;
//     }

//     rows_to_select.forEach((row)=>{
//         if(!row.getData().is_disabled){
//             if(row.getData().is_row_selected){
//                 row.select();
//                 const input = $('input', row.getCell('rowSelection').getElement());
//                 input?.prop('checked', true);
//             }else{
//                 row.getData().is_row_selected = false
//                 row.deselect();
//                 const input = $('input', row.getCell('rowSelection').getElement());
//                 input?.prop('checked', false);
//             }
//         }
//     });
// }

/*
// this is for select all
var allData = tempTable.TabulatorObj.getData();
allData.forEach(obj => obj.rowSelection = true);
tempTable.TabulatorObj.updateData(allData);

// rowSelect formater
if rowSelection = true then [x] else []
*/
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" handleUpdateEditedRow ">
//___ORG___handleUpdateEditedRow = () => {
//    iConsole('--- handleUpdateEditedRow---');
//    // getting the updated records from Tabulator
//    //        const updatedRecords = this.TabulatorObj.getSelectedData();
//
//    const updatedRecords = this.TabulatorObj.getSelectedData()
//        ?.filter((data) => data?.isUpdated)
//        .map((data) => {
//            delete data.isUpdated;
//            delete data.is_row_selected;
//            return data;
//        });
//
//    //        if (updatedRecords.length == 0) {
//    //            alert('Nothing to update.');
//    //            return;
//    //        }
//
//    if (!shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_row_save_before, this, updatedRecords[0])) {
//        // add class is-invalid_bycode to bypass the regular check
//        return;
//    }
//
//    let row = this.TabulatorObj.getSelectedRows()[0];
//    let cells = row.getCells();
//    $.each(cells, (inx, cell) => {
//        let $cell = cell.getElement();
//        let cell_def = cell.getColumn().getDefinition();
//        let cell_val = cell.getRow().getData()[cell_def.field];
//        if (!$(':input', $cell).hasClass('is-invalid_bycode')) {
//            $(':input', $cell).removeClass('is-invalid');
//            if (cell_def.validator === 'required' && (cell_val === undefined || cell_val === null || cell_val === '')) {
//                $(':input', $cell).addClass('is-invalid');
//            }
//        }
//    });
//
//    let $row = row.getElement();
//    $(':input.is-invalid:first', $row).focus();
//    if ($(':input.is-invalid', $row).length !== 0) {
//        return;
//    }
//    this.AdditionalTabulatorInitOptions.iTr_row_save_after?.({ updates: updatedRecords, row: row });
//};
// </editor-fold>

//#endregion
// </editor-fold>
