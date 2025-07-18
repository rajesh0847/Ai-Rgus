CONSOLE_ON = 1;
let _TESTING_NB = window.location.hostname === 'app.lvh.me' ? 0 : 1;

var blueColor = '#2980ba';

var DEFAULT_PAGE_SIZE = 25;
var DateTime = luxon.DateTime;

// <editor-fold defaultstate="collapsed" desc=" class: FeaturedTable ">
//#region -class: FeaturedTable
class FeaturedTable {
    // <editor-fold defaultstate="collapsed" desc=" initilization params ">
    //#region -  initilization params
    TabulatorObj = null;
    additionalAjaxParams = {};
    tableContainer = null;

    initMode = 'infinite-loading'; // [infinite-loading | paginated-local | paginated-remote]
    tableContainerElement = $('.infinite-table-container');
    fTbl_format = 'TMPL_tbl_toolbars_f01';
    fTbl_controlers = {
        // dropdown and settings config  use {['tbl_rowSel' | 'tbl_read_mode' | 'rowEditing' | 'tbl_multy_purps' | 'tblSearch' ]:{"remove": 1}} to remove the place holder element
        TMPL_tbl_toolbars_f01: [
            { tbl_read_mode: { c: 'me-2' } },
            { rowEditing: { c: 'me-2' } },
            { tbl_multy_purps: { c: 'me-2' } },
            { tblSearch: { c: 'me-2', input_w: 350 } },
            { tblColVisibility: { c: 'me-2' } },
            { tblExport: { c: 'me-2' } },
            { tblSettings: { c: '' } },
        ],
        TMPL_tbl_toolbars_f02: [{ tbl_read_mode: { c: 'me-2' } }, { rowEditing: { c: 'me-2' } }],
        TMPL_tbl_toolbars_f03: [{ tbl_upload_rows: { c: 'me-2' } }],
    };
    _tbl_columns_field_names_reserved = ['isCurrentRow'];
    tbl_ExpandRows = []; // stroring the expanded rows ids

    DefaultHiddenColumns = []; // ['dob', 'name']

    /*
     *
     */
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
    //  _iExcludeFromList - object ({src:0, cv: 0}) used to show/hide the select-dropdown checkbbox and it's label from the list.
    //  expandToKeyData - used for nested table, when getting data and sorting the data by that key.
    //  expandTo - takes a function, which will run when clicked on expand button and opens the table for that row.
    //
    //}

    // storing column is present or not
    isRowExpandColPresent = false; // it is set automaticaly by the code
    isRowSelectionColPresent = false; // it is set automaticaly by the code
    editedRowData = null; // it is set automaticaly by the code : we use it like for paginated, to be able to show the edited row on teh next page
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

        iTr_enableEditMode_end: null, // function(){ return true; }

        iTr_row_save_before: null, // function (FeaturedTable, ...fieldData) {
        //console.log('------------ iTr_row_save_before --------------');
        //console.log({ fieldData }, FeaturedTable);
        //return true; }
        iTr_row_save_after: null, // function (newData) { }
        iTr_row_discard_after: null, // function(row){ }

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

        //We use this setting for any nested table to shrink or limit the nested table height
        //We can NOT set it here as a default as it will influence any table including the master/main table
        //        maxHeight : "500px",
        //        minHeight : "250px",
        //        height    : "unset",
    };

    // <editor-fold defaultstate="collapsed" desc=" COMMENT: List of the options passed when creating the Class object ">
    //#region -COMMENT: List of the options passed when creating the Class object
    // options = {
    //     tableLocalStorageKey: '',
    //     tableContainer:'',
    //     DefaultHiddenColumns: [''],
    //     iTr_run_before_creatingTr: function
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
    hasUserFiltered = false;

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
        this.localStorageKey = `${options.tableLocalStorageKey}_tabulator_settings`;
        this.tableContainer = options.tableContainer;

        options.iTr_run_before_creatingTr?.(this);

        if (Store.get(this.localStorageKey)) {
            iConsole('-----------', Store.get(this.localStorageKey));
            this.TableSettings = Store.get(this.localStorageKey);
        }

        // for initializating the tabulator for 'pagination' and 'infinite-loading' mode
        this.initMode = mode; // ABBR -> initializationMode  (needed to initialize the table with different modes like <local-paginated>|<inifinite-loading>)
        this.AdditionalTabulatorInitOptions = $.extend(true, this.AdditionalTabulatorInitOptions, options.TabulatorInitOptions);

        this.exports = options.exports ?? {};
        this.DefaultHiddenColumns = options.DefaultHiddenColumns || [];
        this.fTbl_format = options.fTbl_format || this.fTbl_format;
        this.fTbl_controlers = options.fTbl_controlers?.[this.fTbl_format] ?? this.fTbl_controlers[this.fTbl_format];

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

    // <editor-fold defaultstate="collapsed" desc=" fn: getInitOptions ">
    //#region - fn, getInitOptions
    getInitOptions = () => {
        /**
         * @type {import("../types/tabulator.js").Tabulator.Options}
         */
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
            placeholderHeaderFilter: 'No Matching Data',
            //            placeholder: 'No Data Set',
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
                if (row.getData().isCurrentRow?.new_row) {
                    $(row.getCell('id').getElement()).addClass('visible-hidden');
                }

                if (this.isRowExpandColPresent && (row.getData().isCurrentRow?.edit_mode || row.getData().isCurrentRow?.new_row)) {
                    $('.expand-btn', row.getCell('rowExpand').getElement()).addClass('disabled').removeClass('btn-success'); //.prop('disabled', true);
                }

                this.iTr_row_formatter_after?.(row);
            },

            ...this.AdditionalTabulatorInitOptions,
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
            console.log('column.field', column.field);
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
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                        // expandToKeyData : "gender", // <- use this to send conditions to the nested table settings

                        formatter: function (cell, formatterParams, onRendered) {
                            let el = '';
                            let create_el = true;
                            if (formatterParams.toDoItBy || '' !== '') {
                                if (cell.getData()[formatterParams.toDoItBy] !== 1) {
                                    create_el = false;
                                }
                            }
                            if (create_el) {
                                el = _this.cellF_rowExpand(cell, formatterParams, onRendered, cell.getColumn().getDefinition()['expandTo']);
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
                        //  have teh row select based on D.B. info, the retuned JSON need to have
                        //          is_row_selected => true
                        title: 'Select',
                        field: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        width: 60,
                        iExcludeFromList: { src: 0, cv: 0 },
                        print: false,
                        download: false,
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
                        iExcludeFromList: { cv: 0 }, // to appear on: scr: search dropdown, cv: column visibility dropdown   // to appear on: scr: search dropdown, cv: column visibility dropdown
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
                        iExcludeFromList: { src: 0, cv: 0 }, // to appear on: scr: search dropdown, v: column visibility dropdown
                        ...column,
                    };
                    break;
                default:
                    col_rowExpand = { ...column };
                    break;
            }
            if (col_rowExpand?.iTr_add_fieldSelect) {
                col_rowExpand.headerFilter = (cell, onRendered, success, cancel) => {
                    const className = `${col_rowExpand.field}_header_select`;
                    const div = $(`<div></div>`).addClass(className);
                    return div[0];
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
        //                    if(formatterParams.toDoItBy || "" !== ""){
        //                        if(cell.getData()[formatterParams.toDoItBy] !== 1){
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

            let inputs = $('.form-check-input:checked', this.tbl_MasterSearch_colsdDdown)
                .map(function () {
                    return this;
                })
                .get(); // convert the jQuery object into a plain array

            const columnsToSearch = Array.from(inputs).map((input) => {
                return $(input).prop('value');
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
                const btn = $(`<button class="btn">${type}</button>`).click(this.exportsFn[type.toLowerCase()]);
                tbl_ExportTo_menu.find('.download-btns').append(btn);
            });
        }
        //#endregion
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc=" adding elements to: table header toolbar ">
        //#region -tbl_ExportTo_menu
        let tblContainer = this.tableContainerElement;
        let appendTo_el = $('.table-header-toolbar_w', tblContainer);
        $('.table-header-toolbar_w', tblContainer).empty();
        $('#TMPL_tbl_toolbars_f01').clone(true).removeAttr('id').removeClass('d-none').appendTo(appendTo_el);

        $.each(this.fTbl_controlers, (idx, item) => {
            // do NOT change it to be function(idx, item) the <this> is undefined.
            const [element, el_cls, removeIt] = [Object.keys(item)[0], Object.values(item)[0]['c'], Object.values(item)[0]['remove']];
            switch (element) {
                case 'tbl_upload_rows': {
                    if (removeIt ?? false) {
                        $('.tbl_rowSel_w', tblContainer).remove();
                        this.uploadCopiedRowsBtn = null;
                    } else {
                        this.uploadCopiedRowsBtn = $('#TMPL_upload_row_btn').clone(true).removeAttr('id').removeClass('d-none');
                        $('.tbl_rowSel_w', tblContainer).append(this.uploadCopiedRowsBtn).toggleClass(el_cls);
                        this.uploadCopiedRowsBtn.on('click', () => {
                            // add some default behaviours
                            this.AdditionalTabulatorInitOptions.iTr_on_upload_row_btn_click?.();
                        });
                    }
                    break;
                }
                case 'tbl_rowSel': {
                    if (removeIt ?? false) {
                        $('.tbl_rowSel_w', tblContainer).remove();
                    }
                    break;
                }
                case 'tbl_read_mode': {
                    if (removeIt ?? false) {
                        $('.tbl_read_mode_w', tblContainer).remove();
                    } else {
                        $('.tbl_read_mode_w', tblContainer).append($(this.addNewRowBtn).toggleClass(el_cls));
                    }
                    break;
                }
                case 'rowEditing': {
                    if (removeIt ?? false) {
                        $('.tbl_single_select_w', tblContainer).remove();
                    } else {
                        $('.tbl_single_select_w', tblContainer).append($(this.rowOperationsContainer).toggleClass(el_cls));
                    }
                    break;
                }
                case 'tbl_multy_purps': {
                    // the central area above the table
                    if (removeIt ?? false) {
                        $('.tbl_multy_purps_w', tblContainer).remove();
                    } else {
                        $('.tbl_multy_purps_w', tblContainer)
                            .append($('#TMPL_multi_purpose_btns_template').clone(true).removeAttr('id').removeClass('d-none'))
                            .toggleClass(el_cls);
                    }
                    break;
                }
                case 'tblSearch': {
                    if (removeIt ?? false) {
                        $('.tbl_ctrls_w', tblContainer).remove();
                    } else {
                        let mFilter_width = this.fTbl_controlers.find((obj) => obj.tblSearch)?.tblSearch?.input_w;

                        const tbl_MasterSearch_w = iGet_el_MasterFilter({
                            input_el: { style: `width: ${mFilter_width}px; padding-right: 60px;` },
                        });

                        const tbl_MasterSearch_colsdDdown = iGet_el_SelectDropdown({
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
                        // adding it to this, to access it outside of this case.
                        this.tbl_MasterSearch_colsdDdown = tbl_MasterSearch_colsdDdown;

                        tbl_MasterSearch_w.append(tbl_MasterSearch_colsdDdown);

                        // <editor-fold defaultstate="collapsed" desc=" Function to search table, for local tables ">
                        //#region -Function to search table, for local tables
                        const iTr_searchTbl_local = (search) => {
                            let selectedColumns = $('.dropdown-menu .dds_itemsList_w input:checked', tbl_MasterSearch_colsdDdown).toArray();
                            let filters = selectedColumns.map((col) => ({
                                field: $(col).val(),
                                type: 'like',
                                value: search,
                            }));
                            // update the filter to trigger Tabulator search
                            if (filters.length > 0) {
                                this.TabulatorObj.setFilter([filters]);
                            }

                            // needed to update the status bar on table when doing local searching
                            // this event is needed to get exact number of rows after filters
                            this.updateStatus();
                        };
                        //#endregion
                        // </editor-fold>

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
                                    this.TabulatorObj.setFilter([]);
                                }
                            }
                            if (this.TableSettings.filter_by.on_type.enabled) {
                                if (this.initMode == 'paginated-local') {
                                    iTr_searchTbl_local($(e.target).prop('value'));
                                } else {
                                    handleSearchDebounced.fn(e); // Needed to trigger the search for <on_type> flag with certain amount of delay.
                                }
                            }
                        });
                        //#endregion
                        // </editor-fold>

                        $('.tbl_ctrls_w', tblContainer).append($(tbl_MasterSearch_w).toggleClass(el_cls));
                    }
                    break;
                }
                case 'tblColVisibility': {
                    // <editor-fold defaultstate="collapsed" desc=" tbl_ColumsToggleVisib_menu ">
                    //#region -tbl_ColumsToggleVisib_menu
                    const tbl_ColumsToggleVisib_menu = iGet_el_SelectDropdown({
                        calling_for: 'colsVisibility',
                        el_w: { class: 'col-auto px-0' },
                        dd_title: { text: 'Select which table columns to view' },
                        dd_filter: { input: { placeholder: 'Search column name...' }, show: '.chboxSelect' },
                        dd_select_list: { data: this.getTableColumns(), exludeBy: 'cv' },
                        applayBtns: { show: 0 },
                        fn_onInptChkChange: (e) => {
                            const val = e.target.value;
                            const ele = this.tbl_MasterSearch_colsdDdown.find(`.dds_itemsList_w input[value=${val}]`);
                            iConsole('ColumsToggleVisib, onInptChkChange', e.target, ele);

                            if (!e.target.checked) {
                                this.TabulatorObj.hideColumn(val);
                                if (this.TableSettings.persist_column_visibility.enabled && !this.DefaultHiddenColumns.includes(val)) {
                                    this.TableSettings.persist_column_visibility.hiddenColumns.push(val);
                                }

                                //                    ele.closest(".form-check").attr({'data-hidden-from-menu': true});
                                ele.closest('.form-check').attr({ 'data-hidden-from-menu': true, 'data-hidden-by-col_view': true });
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

                                ele.closest('.form-check').attr({ 'data-hidden-from-menu': false, 'data-hidden-by-col_view': false });
                                $(ele).prop('checked', false); // We are doing the false because ".click" is doing its work and making uncheck to check
                                $(ele).click();
                            }
                            Store.set(this.localStorageKey, this.TableSettings);
                        },
                    });
                    //#endregion
                    // </editor-fold>
                    $('.tbl_ctrls_w', tblContainer).append($(tbl_ColumsToggleVisib_menu).toggleClass(el_cls));
                    break;
                }
                case 'tblExport': {
                    $('.tbl_ctrls_w', tblContainer).append($(tbl_ExportTo_menu).toggleClass(el_cls));
                    break;
                }
                case 'tblSettings': {
                    $('.tbl_ctrls_w', tblContainer).append($(tbl_Setting_menu).toggleClass(el_cls));
                    break;
                }
                default: {
                }
            }
        });
        //#endregion
        // </editor-fold>

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

    // <editor-fold defaultstate="collapsed" desc=" fn: initTabulatorEvents ">
    //#region fn: initTabulatorEvents
    initTabulatorEvents = () => {
        // needed in remote-tables to restore back the editing row, when it is getting new data.
        this.TabulatorObj.on('dataLoading', this.saveEditedRowData);

        this.TabulatorObj.on('dataProcessing', (newProcessedPageData) => {
            //  triggered after data has been processed and the table has been rendered and before format row
            this.updateCurrentPageDate(newProcessedPageData);
        });
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

            this.hasUserFiltered = true;
        });

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
                if (this.isRowSelectionColPresent) {
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
        });

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

        // add sorting event, for adding the sorting badge number.
        if (this.AdditionalTabulatorInitOptions.iTr_showSortingBadgeNumber) {
            this.TabulatorObj.on('dataSorting', (sorters) => {
                // add badge on multiple sorting
                if (sorters.length <= 1) {
                    // console.log("11111111111111111111")
                    $('.custom-badge', this.tableContainerElement).remove();
                } else {
                    //                if(sorters.length > 1){
                    // console.log("11111111111111111111", sorters.length)
                    sorters.forEach((sort, idx) => {
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
        }

        // fix for disabling all of the checkboxes when row-editing is enabled for local tables.
        // need as the disabl logic inside editMode handler is not working for local tables.
        this.TabulatorObj.on('scrollVertical', () => {
            iBS_hideAll_Dropdowns();
            iBS_hideAll_Popovers();
            // this.toggleAllTblRowsToCheck();

            // check and select the visible rows, when is_row_selected is true for the row.
            this.TabulatorObj.getRows('visible').forEach((row) => {
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

        this.TabulatorObj.on('rowSelectionChanged', (data, rows) => {
            // this.timers.rowSelectionChanged.fn(()=>{
            //     this.trackRowsSelection(data, rows);

            //     iBS_hideAll_Popovers();
            //     iBS_hideAll_Dropdowns();
            // })
            // iConsole('rowSelectionChanged');
            // this.trackRowsSelection(data, rows);

            iBS_hideAll_Popovers();
            iBS_hideAll_Dropdowns();
        });

        this.TabulatorObj.on('rowSelected', (row) => {
            console.log('rowSelected');
            // const id = row.getData()[this.TabulatorObj.options.index] ?? null;
            // if (id == null) {
            //     return;
            // }
            // this.selectedRowsSet.add(id);
            this.AdditionalTabulatorInitOptions.iTr_rowselectionChanged?.(row);
        });

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
            const id = row.getData()[this.TabulatorObj.options.index] ?? null;
            if (id == null) {
                return;
            }
            // this.selectedRowsSet.delete(id);

            if (this.isEditing) {
                const idArr = this.currentPageData.map((data) => data.id);
                // needed to delete the editing row when it's not present in the page-data which is loaded in the Tabulator
                // this would only run when filtering or sorting is done, or change pagination
                if (!idArr.includes(row.getData().id) && this.hasUserFiltered) {
                    iConsole('---  deleting row with id  --->', row.getData().id);
                    iConsole('---  deleting row with id  --->', row.getData().id);
                    this.TabulatorObj.deleteRow(row.getData().id);
                }
            }

            this.AdditionalTabulatorInitOptions.iTr_rowselectionChanged?.(row);
        });

        this.TabulatorObj.on('cellDblClick', (e, cell) => {
            shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_cellDblClick, e, cell);
        });

        // <editor-fold defaultstate="collapsed" desc=" header, add select dropdown ">
        //#region -header, add select dropdown
        const tempTable = this;
        this.TabulatorObj.on('tableBuilt', () => {
            if (tempTable) {
                const iTr_filterColumns = tempTable.getTableColumns().filter((column) => column?.iTr_add_fieldSelect);
                if (iTr_filterColumns?.length) {
                    let uniqueData_for_filters = getUniqueAttributes(
                        tempTable.TabulatorObj.getData(),
                        iTr_filterColumns.map((field) => field.field)
                    ); //list ALL fileds that we are asking to have filter to them
                    const dropdownFilters = iTr_filterColumns.map((item) => {
                        const uniqueRecords = getUniqueCounts(tempTable.TabulatorObj.getData(), item.field); // fetching all table data with rec_name counts
                        let uniqueRecordsArray = createDropdownArray(uniqueRecords, item.field); // fetching unique rec_name in every row
                        const filter = {
                            field: item.field,
                            type: 'in',
                            value: [],
                            uniqueArr: uniqueRecordsArray,
                            click: item?.iTr_add_fieldSelect_fn,
                        };

                        return filter;
                    });
                    console.log('dropdownFilters', dropdownFilters);
                    tempTable.TabulatorObj.on('dataFiltering', function (data) {
                        const filters = tempTable.TabulatorObj.getFilters();
                        // check if more than one filter is applied
                        const appliedFilters = filters.filter((filter) => {
                            if (dropdownFilters.find((dropdownFilter) => dropdownFilter.field === filter.field && filter?.value?.length)) {
                                return true;
                            }
                            return false;
                        });
                        console.log('appliedFilters', appliedFilters.length);
                        dropdownFilters.forEach((filter) => {
                            // Get the column element
                            const colElement = $(
                                `.${filter.field}_header_select`,
                                tempTable.TabulatorObj.getColumn(filter.field).getElement()
                            );

                            // Find the index of the current filter
                            const filterIndex = filters.findIndex((tablefilter) => tablefilter.field === filter.field);

                            // Remove existing badge
                            $('.badge', colElement).remove();

                            // If the filter exists, create a new badge
                            if (filterIndex >= 0 && appliedFilters?.length > 1) {
                                const badge = $(`<span class="badge rounded-pill text-bg-secondary">${filterIndex + 1}</span>`);
                                badge.css('color', 'red'); // Optionally, use a class for styling
                                badge.css('position', 'absolute'); // Optionally, use a class for styling
                                badge.css('margin', '7px'); // Optionally, use a class for styling
                                colElement.append(badge);
                            }
                        });
                        //data - the data loading into the table
                    });

                    /** 
                    @function getDropDownData
                    @description get latest dropdown data for filter
                    @param filterToAvoid - filterName
                    */
                    const getDropDownData = (filterToAvoid) => {
                        try {
                            const filters = tempTable.TabulatorObj.getFilters().filter((filter) => filter.field !== filterToAvoid);
                            const dropdownOptions = uniqueData_for_filters.filter((data) => {
                                return checkFilters(filters, data);
                            });

                            dropdownFilters.forEach((filter) => {
                                if (filter.field === filterToAvoid) {
                                    const existingData = new Set(dropdownOptions.map((item) => item[filterToAvoid]));
                                    filter.uniqueArr.forEach((item) => {
                                        if (!existingData.has(item.field)) {
                                            item.visible = false;
                                        } else {
                                            item.visible = true;
                                        }
                                    });
                                }
                            });
                        } catch (error) {
                            console.log('uniqueData_for', error);
                        }
                    };

                    /**
                     * @description - used to group data based on array of keys
                     * @function getUniqueAttributes
                     * @param arr - Array of dropdown data
                     * @param keys - Keys to group data
                     * @returns array of data
                     */
                    function getUniqueAttributes(arr, keys) {
                        const seen = {};
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
                     * @description - to check if filter contains field value or not
                     * @param filters - dropdown filter
                     * @param data - field data
                     * @returns boolean
                     */
                    function checkFilters(filters, data) {
                        return filters.every((filter) => {
                            const { field, type, value } = filter;
                            if (type === 'in') {
                                // Check if the field exists in data and if its value is in the provided value array
                                return data[field] && value.includes(data[field]);
                            }
                            // Other types can be handled here
                            return false;
                        });
                    }

                    /** creating dropdown */
                    dropdownFilters.forEach((filter, index) => {
                        const dropdown = createDropdown('Filter by', filter.field, filter, index);
                        dropdown.css({ flex: '0 0 80%' });
                        dropdown.on('click', () => handleFilterClick(dropdown, filter, filter.field));
                        const resetButton = createResetButton(() => resetDropdown(index, filter.field, dropdown), filter.field);
                        resetButton.prop('disabled', true);
                        appendDropdownToHeader(dropdown, resetButton, `${filter.field}_header_select`);
                        filter.dropdown = dropdown;
                    });

                    /**
                     *
                     * @param placeholder - dropdown placeholder
                     * @param dropdownId - dropdown id
                     * @param filter - dropdown filter object
                     * @param filterIndex - dropdown filter index
                     * @returns dropdown element
                     */
                    function createDropdown(placeholder, dropdownId, filter, filterIndex) {
                        const dropdown = iGet_el_SelectDropdown({
                            el_w: { class: 'move_ddown_to_body' },
                            calling_btn: {
                                class: 'form-control form-control-sm border py-1',
                                _style: 'border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;',
                                icon: { class: 'fa-line-columns fa-filter' },
                                alt_el: `<span class="pe-2" id="${dropdownId}-btn-text">${placeholder}</span>`,
                                type: filter?.click ? 'button' : 'checkbox',
                                click: filter.click,
                            },
                            dd_element: { class: 'iTr_F_01' },
                            dd_title: { text: placeholder },
                            dd_filter: { input: { placeholder: 'Search...' } },
                            dd_select_all: { class: 'd-none' },
                            dd_select_list: {
                                data: filter.uniqueArr,
                                exludeBy: 'src',
                                label: { style: 'display: ruby-text;' },
                            },
                            TabulatorObj: tempTable.TabulatorObj,
                            fn_onInptChkChange: (e, ops) => {
                                handleCheckboxChange(e, ops, filterIndex, dropdownId);
                            },
                            fn_onDropdown_shown: (e, ops) => {
                                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                                    acc[obj[filter.field]] = (acc[obj[filter.field]] || 0) + 1;
                                    return acc;
                                }, {});
                                getDropDownData(filter.field);
                                // setting selected text to 0 if none is selected in table
                                const dropdown_id = $('button', dropdown).attr('id');
                                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                                $('input.form-check-input', drop_down).prop('checked', 0);
                                $('.selected', drop_down).text('0');

                                $.each(filter.uniqueArr, function (key, value) {
                                    let id = $(
                                        `.dds_itemsList_w input[value="${value.field}"]`,
                                        `[data-for_seldd_id="${$(e.target).attr('id')}"]`
                                    ).attr('id');
                                    const container = $(`#${id}`).closest('.form-check');
                                    if (value.visible == true) {
                                        $(container).attr('data-hidden-from-menu', false);
                                    } else {
                                        $(container).attr('data-hidden-from-menu', true);
                                    }
                                    $(`#${id}`).prop('checked', value.dinm_dd_toCcheck);
                                    $('.selected', `button[id="${id}"]`).text(selected_counts[value.field]);
                                });
                                return true;
                            },
                        });
                        return dropdown;
                    }

                    function getDropDownButton(field) {
                        return $(`#${field}_reset_button`);
                    }

                    function resetDropdown(filterIndex, field, dropdown) {
                        const filterBtnText = $(`#${field}-btn-text`);
                        let filters = tempTable.TabulatorObj.getFilters(true);
                        filters = filters.filter((f) => f.field !== field);
                        dropdownFilters[filterIndex].value = [];
                        tempTable.TabulatorObj.setFilter(filters);
                        filterBtnText.text('Filter by').removeClass('fw-bold');
                        getDropDownButton(field).prop('disabled', true);
                        resetDropdownValue(filterIndex, dropdown);
                    }

                    function resetDropdownValue(index, dropdown) {
                        dropdownFilters[index].uniqueArr = dropdownFilters[index].uniqueArr.map((field) => {
                            field.dinm_dd_toCcheck = false;
                            return field;
                        });

                        const dropdownToggle = $('.iDDselnWfilter_btn', dropdown);
                        bootstrap.Dropdown.getInstance(dropdownToggle)?.hide();
                    }

                    // Helper functions
                    function getUniqueCounts(data, field) {
                        return data.reduce((acc, obj) => {
                            acc[obj[field]] = (acc[obj[field]] || 0) + 1;
                            return acc;
                        }, {});
                    }

                    /**creat dropdown button */
                    function createResetButton(onClick, field) {
                        return $('<button>', {
                            id: `${field}_reset_button`,
                            class: 'iDDselnWfilter_btn btn form-control form-control-sm border py-1',
                            //                            html: '<i class="fa fa-redo"></i><i class="fa fa-rotate-right" data-test-el="1"></i>',
                            html: '<i class="fa fa-redo"></i>',
                            click: onClick,
                        });
                    }

                    /**
                     * @description handle filter button click
                     * @param dropdown - filter dropdown element
                     * @param filter - filter object
                     * @param field - filter field
                     */
                    function handleFilterClick(dropdown, filter, field) {
                        const buttonText = $(`#${field}-btn-text`).text();
                        const dropdownToggle = $('.iDDselnWfilter_btn', dropdown);

                        if (buttonText === 'Apply Filter') {
                            bootstrap.Dropdown.getInstance(dropdownToggle)?.hide();
                            applyFilter(filter, field);
                        }
                    }

                    /**
                     * @description change value of checkbox
                     * @param e - checkbox event
                     * @param ops - checkbox options
                     * @param filterIndex - filter dropdown index
                     * @param field - filter field
                     */
                    function handleCheckboxChange(e, ops, filterIndex, field) {
                        const name = $(e.target).attr('value');
                        const filterBtnText = $(`#${field}-btn-text`);
                        updateCheckedValue(name, filterIndex, $(e.target).prop('checked'));
                        if ($(e.target).prop('checked')) {
                            if (!dropdownFilters[filterIndex].value.includes(name)) {
                                dropdownFilters[filterIndex].value.push(name);
                            }
                        } else {
                            dropdownFilters[filterIndex].value = dropdownFilters[filterIndex].value.filter((rec) => rec !== name);
                        }
                        updateFilterButtonText(filterBtnText, field);
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
                     * @description apply dropdown filter to table
                     * @param filter filter to apply on field
                     * @param field field to apply filter
                     */
                    function applyFilter(filter, field) {
                        const filterBtnText = $(`#${field}-btn-text`);
                        const filters = tempTable.TabulatorObj.getFilters(true);
                        const filterIndex = filters.findIndex((f) => f.field === field);
                        if (filterIndex >= 0) {
                            filters[filterIndex] = filter;
                        } else {
                            filters.push(filter);
                        }
                        tempTable.TabulatorObj.setFilter(filters);
                        filterBtnText.text('Applied filter').addClass('fw-bold');
                    }

                    /**
                     * @description create dropdown option data
                     * @param uniqueCounts - grouped dropdown data by field name
                     * @returns array
                     */
                    function createDropdownArray(uniqueCounts) {
                        return Object.entries(uniqueCounts)
                            .map(([name, count]) => ({
                                field: name,
                                title: `${name} (<span data-counter="${count}" class="selected">0</span>/${count})`,
                                visible: true,
                                dinm_dd_toCcheck: false,
                            }))
                            .sort((a, b) => a.field.localeCompare(b.field));
                    }

                    /**
                     * @description update checkbox value
                     * @param key - field to update
                     * @param fieldIndex - field index
                     * @param value - field value
                     */
                    function updateCheckedValue(key, fieldIndex, value) {
                        dropdownFilters[fieldIndex].uniqueArr = dropdownFilters[fieldIndex].uniqueArr.map((item) => {
                            if (key === item.field) {
                                item.dinm_dd_toCcheck = value;
                            }
                            return item;
                        });
                    }

                    /**
                     * @description append dropdown in header cell
                     * @param dropdown - dropdown element
                     * @param button - dropdown button
                     * @param headerClass - class name where we append dropdown
                     */
                    function appendDropdownToHeader(dropdown, button, headerClass) {
                        const headerSelect = $(`.${headerClass}`, $(tempTable.TabulatorObj.element.closest(tempTable.tableContainer)))[0];
                        $(headerSelect).css({ display: 'flex', alignItems: 'flex-end', gap: '5px' });
                        $(headerSelect).append(dropdown).append(button);
                    }
                }
            }
        });
        //#endregion
        // </editor-fold>

        // Handle cell edit
        // this.TabulatorObj.on('cellEdited', (cell) => {
        //     const updatedData = cell._cell.row.data;
        //     this.TabulatorObj?.updateData([{ ...updatedData, isUpdated: true }]);
        // });

        if (this.AdditionalTabulatorInitOptions.iTr_clipboard_copy_after) {
            this.TabulatorObj.on('clipboardPasted', (clipboard) => {
                // getting rows which are added by the clipboard, by comparing with old and new table rows.
                const new_rows = this.TabulatorObj.getRows().slice(this.currentPageData.length, this.TabulatorObj.getRows().length);
                this.currentPageData = this.TabulatorObj.getRows().map((row) => row.getData());

                this.AdditionalTabulatorInitOptions.iTr_clipboard_copy_after(new_rows);
                $(this.uploadCopiedRowsBtn).prop('disabled', false);
            });
        }

        if (this.AdditionalTabulatorInitOptions.iTr_moveRowSelectionOnKeyDown) {
            $(this.tableContainerElement).keydown(this.moveRowSelectionOnKeyDown);
        }

        // Update the status row initially
        // this.updateStatus();

        // Update the status row whenever the table data is updated
        this.TabulatorObj.on('dataLoaded', this.updateStatus);
        this.TabulatorObj.on('dataChanged', this.updateStatus);
        this.TabulatorObj.on('rowAdded', this.updateStatus);
        this.TabulatorObj.on('rowDeleted', this.updateStatus);
        this.TabulatorObj.on('rowUpdated', this.updateStatus);
        this.TabulatorObj.on('renderComplete', this.updateStatus);
        this.TabulatorObj.on('scrollVertical', this.updateStatus);
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
            if (this.isRowSelectionColPresent) {
                $('input', row.getCell('rowSelection').getElement()).prop('disabled', fn.setTo);
            }
        });
        this.isEditing = fn.setTo;

        if (fn.setMore) {
            this.toggleTbl_read_mode_w(!fn.setTo);
            // adding it here to fix the collison with renderComplete event, it is disabling the checkbox again after disabling the edit mode
            //            this.isEditing = fn.setTo;
            this.deselectSelectedRows(!fn.setTo, fn.isNewRow);

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
        const id = Date.now().toString();

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

        if (settings.for_newRow) {
            this.TabulatorObj.addData(settings.for_newRow.data);

            // unselect the original row from which the new-row is generated
            this.deselectSelectedRows();

            // get the new added row and freeze it
            const newRow = this.TabulatorObj.getRow(settings.for_newRow.data.id);
            // newRow.select();
            this.selectRowAndCheckInput(newRow);
            newRow.freeze();

            // update the currentSelectedRows
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

        (this.currentSelectedRows[0].getData().isCurrentRow ??= {}).edit_mode = true;

        //        if (!shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_enableEditMode_end)) {
        //            return;
        //        }

        // reformatting to activate the cell/row formatter
        this.currentSelectedRows[0].reformat();

        // if editing is enabled, then disable row-expand and row-select elements in the row element.
        if (this.isRowExpandColPresent) {
            $('button', this.currentSelectedRows[0].getCell('rowExpand').getElement()).prop('disabled', this.isEditing);
        }
        if (this.isRowSelectionColPresent) {
            $('input', this.currentSelectedRows[0].getCell('rowSelection').getElement()).prop('disabled', this.isEditing);
        }

        this.AdditionalTabulatorInitOptions.iTr_enableEditMode_end?.();
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
            if (!$(':input', $cell).hasClass('is-invalid_bycode')) {
                $(':input', $cell).removeClass('is-invalid');
                if (cell_def.validator === 'required' && (cell_val === undefined || cell_val === null || cell_val === '')) {
                    $(':input', $cell).addClass('is-invalid');
                }
            }
        });

        let $row = row.getElement();
        $(':input.is-invalid:first', $row).focus();
        if ($(':input.is-invalid', $row).length !== 0) {
            return;
        }

        this.AdditionalTabulatorInitOptions.iTr_row_save_after?.({ updates: updatedRecords, row: row });
    };
    ___ORG___handleUpdateEditedRow = () => {
        iConsole('--- handleUpdateEditedRow---');
        // getting the updated records from Tabulator
        //        const updatedRecords = this.TabulatorObj.getSelectedData();

        const updatedRecords = this.TabulatorObj.getSelectedData()
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

        if (!shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_row_save_before, this, updatedRecords[0])) {
            // add class is-invalid_bycode to bypass the regular check
            return;
        }

        let row = this.TabulatorObj.getSelectedRows()[0];
        let cells = row.getCells();
        $.each(cells, (inx, cell) => {
            let $cell = cell.getElement();
            let cell_def = cell.getColumn().getDefinition();
            let cell_val = cell.getRow().getData()[cell_def.field];
            if (!$(':input', $cell).hasClass('is-invalid_bycode')) {
                $(':input', $cell).removeClass('is-invalid');
                if (cell_def.validator === 'required' && (cell_val === undefined || cell_val === null || cell_val === '')) {
                    $(':input', $cell).addClass('is-invalid');
                }
            }
        });

        let $row = row.getElement();
        $(':input.is-invalid:first', $row).focus();
        if ($(':input.is-invalid', $row).length !== 0) {
            return;
        }
        this.AdditionalTabulatorInitOptions.iTr_row_save_after?.({ updates: updatedRecords, row: row });
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
    deselectSelectedRows = (delete_iTr_edit_row, isNewRow) => {
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
                if (!idArr.includes(row.getData().id) && this.hasUserFiltered) {
                    iConsole('---  deleting row with id  --->', row.getData().id);
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
                if (this.isRowExpandColPresent) {
                    $('button', row.getCell('rowExpand').getElement()).prop('disabled', shouldDisable);
                }
                if (this.isRowSelectionColPresent) {
                    $('input', row.getCell('rowSelection').getElement()).prop('disabled', shouldDisable);
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
        const visibleRows = this.TabulatorObj.getRows('visible');
        const filteredRows = this.TabulatorObj.getRows('active');
        const visibleCount = visibleRows.length;
        const start = visibleCount > 0 ? visibleRows[0].getPosition() : 0;
        const end = visibleCount > 0 ? visibleRows[visibleCount - 1].getPosition() : 0;

        if (this.hasUserFiltered) {
            //                   <span class='fw-normal text-dark'>Showing ${start} to ${end} of ${rowCount} rows ${rowCount > filteredRows.length ? `(${filteredRows.length} filtered rows)`:""}</span>
            $('.table-status', this.TabulatorObj.element).html(
                `<div>
                   <span class='fw-normal text-dark'>Showing <b>${start} to ${end} of ${
                    rowCount > filteredRows.length ? `${filteredRows.length} filtered rows` : ''
                } (${rowCount} total)</b></span>
                </div>`
            );
        } else {
            $('.table-status', this.TabulatorObj.element).html(
                `<span class='fw-normal text-dark'>Showing <b>${start} to ${end} of ${rowCount} rows</b></span>`
            );
        }

        /* till 10-09-2024
        const rowCount = this.TabulatorObj.getDataCount(); // Get total row count
        const visible_row = this.TabulatorObj.getRows("visible").map((row)=> row.getData().id);
        const start = visible_row[0] ?? 0;
        const end = visible_row[visible_row.length-1] ?? 0;
        iConsole({visible_row}, start, end, this.hasUserFiltered);

        if(this.hasUserFiltered){
            $('.table-status', this.TabulatorObj.element).html(
                `<div>
                   <span class='fw-normal text-dark'>Showing ${start} to ${end} of ${rowCount} rows.</span>
                </div>`
            );
        }else{
            $('.table-status', this.TabulatorObj.element).html(
                `<span class='fw-normal text-dark'>Showing ${start} to ${end} of ${rowCount} rows.</span>`
            );
        }
        */

        /*  const rowCount = this.TabulatorObj.getDataCount(); // Get total row count
        let showingCount = this.TabulatorObj.getRows().length; // Get currently displayed row count
        // showingCount = this.TabulatorObj.getData().length
        if(Array.isArray(result_rows)){
            showingCount = result_rows.length
            iConsole({result_rows}, result_rows.length, showingCount)
        }
        iConsole({result_rows}, result_rows?.length, showingCount,this.hasUserFiltered)

        if(this.hasUserFiltered){
            $('.table-status', this.TabulatorObj.element).html(
                `<div>
                    <span class='fw-normal text-dark'>Rows: ${showingCount} of ${rowCount}</span>
                </div>`
            );
        }else{
            $('.table-status', this.TabulatorObj.element).html(
                `<span class='fw-normal text-dark'>Rows: ${rowCount}</span>`
            );
        }
        
        $('.table-status', this.TabulatorObj.element).append(this.tbl_Setting_menu); */
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" cellF_rowExpand ">
    //#region -cellF_rowExpand
    //    cellF_rowExpand = (cell, formatterParams, onRendered, expandRowWithNestedTable_Fn, expanded_row) => {
    cellF_rowExpand = (cell, formatterParams, onRendered, expandRowWithNestedTable_Fn) => {
        let row = cell.getRow();
        let expanded_row = row;
        let returnVal = null;

        const button = $(
            `<button type="button" class="expand-btn btn btn-sm btn-success m-0 p-0"><i class="fas fa-plus px-1"></i></button>`
        ).click((e) => {
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

                $(row.getElement()).removeClass('row_expended');
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
            }

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
        });

        returnVal = $(button)[0];
        return returnVal;
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
                iWifi: 'fa fa-wifi',
                iVideo: 'fa fa-video',
                iCassette: 'fal fa-cassette-tape',
                iWifiSlash: 'fal fa-wifi-slash',
                iMute: 'fas fa-volume-mute',

                iMinus: 'fas fa-minus',
                iQuestion: 'fas fa-question',
                infinity: 'fas fa-infinity',
            },
            class: null,
        };
        let sets = $.extend(true, defs, opts);

        $(sets['el']).addClass(sets['el_class_by_val'][val]).toggleClass(sets.class);
        return $(sets['el']).prop('outerHTML');
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" iTr_cell_OnOff_insertEl ">
    //#region -iTr_cell_OnOff_insertEl
    iTr_cell_OnOff_insertEl = (cell, onRendered, opts = {}) => {
        /* Creating the <Select> element
         * for Header/Filter we return the element
         * for Cell we will add it to the cell and handling the onchange event
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

            let option = $(`<option [data-el_for="${kk}"]></option>`).val(vv['v']).text(vv['t']);
            $($select).append(option);
        });

        $($select).val(cell.getValue());

        if (cell.getType() === 'header') {
            $($select).toggleClass(sets['TMPL_el_class']);
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

        const $input = $(`<input class="form-control form-control-sm">`).val(cell_val);
        formatterParams.iEl_editMode?.($input, cell);

        $input
            .on('focus', (e) => {
                if (!shouldRunAndProceed(formatterParams.iOnFocus, e, cell)) {
                    return;
                }
            })
            .on('input change', (e) => {
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
                if (!shouldRunAndProceed(formatterParams.iOnBlur, e, cell)) {
                    return;
                }
            });

        return $input[0];
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
            formatterParams.iEl_viewMode?.(cell);
            return cell.getValue();
            //            return $(cell.getElement()).prop("outerHTML");
        }
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" iTr_cell_dropdown_insertEl ">
    //#region -iTr_cell_dropdown_insertEl
    iTr_cell_dropdown_insertEl = (cell, onRendered, columnDefinition, formatterParams) => {
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
        const id = `btn-${cell.getRow().getIndex()}-${columnDefinition.field}`;
        const dropdown = iGet_el_SelectDropdown({
            el_w: { class: 'move_ddown_to_body' },
            calling_btn: {
                class: `form-control form-control-sm border py-1 bg-white text-start`,
                _style: 'border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;',
                icon: { class: 'fa-line-columns fa-filter' },
                alt_el: $('<span>', {
                    id: id,
                    class: 'pe-2',
                    html: cell.getValue(),
                    click: (e) => {
                        e.stopPropagation();
                    },
                }),
                type: 'button',
                removeFontBold: true,
                click: (e, value, listItem) => {
                    this.toggleUpdateBtnOnChange();
                    const filterBtnText = $(`#${id}`, dropdown);
                    filterBtnText.text(e.val());
                    cell.getData()[cell.getField()] = e.val();
                    cell.getData().isUpdated = true;
                    $(`.iDDselnWfilter_btn`, dropdown).removeClass('fw-bold');
                    // cell.setValue(listItem.label);

                    formatterParams.iDropdown_select_after?.(cell, e, listItem);
                },
            },
            dd_element: { class: 'iTr_F_01' },
            // dd_title: { text: "search value..." },
            dd_filter: { input: { placeholder: 'Search...' } },
            dd_select_all: { class: 'd-none' },
            dd_select_list: {
                data: formatterParams.iDropdown_getlist(cell, onRendered, columnDefinition),
                dVal: formatterParams.value,
                dTxt: formatterParams.label,
                attributeKey: formatterParams.attributeKey,
            },
            separtor_el: { val: '---', style: 'padding: 8px;' },
            //            TabulatorObj: tempTable.TabulatorObj,
            TabulatorObj: this.TabulatorObj,
        });
        $(`.iDDselnWfilter_btn`, dropdown).css({
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            overflow: 'hidden',
        });

        //return the editor element
        return dropdown.get(0);
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" iTr_cell_date_editor_formatterEl ">
    //#region -iTr_cell_date_editor_formatterEl
    iTr_cell_date_editor_formatterEl = (cell, formatterParams, onRendered) => {
        formatterParams = { type: 'date', ...formatterParams };

        let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;
        let ww = { date: 108, 'datetime-local': 171 };
        let ff = { date: 'yyyy-MM-dd', 'datetime-local': 'yyyy-MM-dd HH:mm:ss' };

        if (editMode) {
            //            const date = new Date(cell.getValue());
            //            const cellValue = DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
            const cellValue = DateTime.fromISO((cell.getValue() || '').replace(' ', 'T'), { zone: 'utc' }).toFormat(
                ff[formatterParams.type]
            );

            const input = $(
                `<input class="form-control form-control-sm" type="${formatterParams.type}" style="width: ${ww[formatterParams.type]}px;">`
            )
                .val(cellValue)
                .on('blur', (e) => {
                    // This is another way to do it BUT it reformats the row and if we have a class is-invalid we will lose it
                    // cell.getTable().updateData([
                    //     { ...cell.getRow().getData(), [cell.getField()]: DateTime.fromFormat($(this).val(), 'yyyy-MM-dd').toFormat('yyyy-MM-dd'), isUpdated: true },
                    // ]);
                    cell.getData()[cell.getField()] = DateTime.fromFormat($(e.target).val(), ff[formatterParams.type]).toFormat(
                        ff[formatterParams.type]
                    );
                    cell.getData().isUpdated = true;
                })
                .on('change', (e) => {
                    this.toggleUpdateBtnOnChange(e, cell);
                });

            return input[0];
        } else {
            //            return DateTime.fromJSDate(new Date(cell.getValue())).toFormat('MM/dd/yyyy');
            return DateTime.fromISO((cell.getValue() || '').replace(' ', 'T')).toFormat(ff[formatterParams.type]); // the .replace(' ', 'T') is to have teh date time in ISO format
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
                this.TabulatorObj.getRows('visible').forEach((row) => {
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
            this.AdditionalTabulatorInitOptions.iTr_on_row_selection_multiple?.();
        }
        // trigger routine according the selected rows length------------------------------------------------end

        // toggle actions btns according to selected rows length ---------------------------------------
        // hide row operations
        if (this.currentSelectedRows.length == 0 || this.currentSelectedRows.length > 1) {
            this.toggleSingleRowOperationsContainer(false);
            this.toggleDuplicateRowBtn(false);
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

    // <editor-fold defaultstate="collapsed" desc="export function">
    //#region - export function
    exportsFn = {
        excel: () => {
            // it download filters data automatically.
            this.TabulatorObj.download('xlsx', `${this.localStorageKey}.xlsx`, {
                title: 'Report',
                orientation: 'portrait',
            });
        },
        print: () => {
            if (this.AdditionalTabulatorInitOptions.iTr_export_only_filtered_data && this.TabulatorObj.getHeaderFilters().length > 0) {
                // print only filtered rows
                this.TabulatorObj.print([], true, {});
            } else {
                this.TabulatorObj.print('all', true, {});
            }
        },
        pdf: () => {
            const tabulator = this.TabulatorObj;
            const { jsPDF } = window.jspdf;
            const hiddenCols = getHiddenCols.call(tabulator);

            // Define columns
            const columns = tabulator
                .getColumns()
                .map((column) => (column.isVisible() ? column.getDefinition() : null))
                .filter((col) => col != null && col.field != '__dummy__' && col?.field != 'rowSelection' && col?.field != 'rowExpand');

            const index_order_of_columns = {};
            const col_styles = {};
            // collecting all of the accessor downloads function used to replace the value -> like gender == male then gender will be 1 else 0 in pdf.
            const accessor_downloads = {};

            columns.forEach((col, idx) => {
                index_order_of_columns[col.field] = idx;
                if (col.iTr_pdf_export_col_styles) {
                    col_styles[idx] = col.iTr_pdf_export_col_styles;
                }
                if (col.iTr_pdf_accessorDownload) {
                    accessor_downloads[col.field] = col.iTr_pdf_accessorDownload;
                }
            });

            let export_rows = tabulator.getData();

            // if iTr_export_only_filtered_data flag is true, then export only filtered data.
            // overwriting the table data
            if (this.AdditionalTabulatorInitOptions.iTr_export_only_filtered_data && this.TabulatorObj.getHeaderFilters().length > 0) {
                export_rows = this.filtered_tbl_data.map((row) => row.getData()); // conerting the data to appropriate format
            }

            export_rows = export_rows
                .map((data, idx) => {
                    // delete rowSelection column
                    delete data.is_row_selected;
                    Object.keys(data).forEach((key) => {
                        if (hiddenCols.includes(key)) {
                            delete data[key];
                        }
                        // modify the value
                        accessor_downloads[key]?.(data);
                    });

                    // if (data.gender) {
                    //     if (data.gender == 'male') {
                    //         data.gender = '1';
                    //     }
                    //     if (data.gender == 'female') {
                    //         data.gender = '2';
                    //     }
                    // }
                    return data;
                    // }).map((data) => Object.values(data));
                })
                .map((data) => {
                    const res = [];
                    // pushing data in exact order same as column index
                    Object.keys(data).forEach((key) => {
                        if (index_order_of_columns[key] != null) {
                            res[index_order_of_columns[key]] = data[key];
                        }
                    });
                    return res;
                });

            // First pass: Create a temporary document to get the total page count
            const tempDoc = new jsPDF();
            tempDoc.autoTable({
                head: [columns],
                body: export_rows,
                startY: 0,
            });
            const totalPages = tempDoc.internal.getNumberOfPages();

            // Second pass: Create the final document with footer
            const finalDoc = new jsPDF();
            // console.log(col_styles)

            const pageDimensions = finalDoc.internal.pageSize;
            const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
            const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();
            finalDoc.autoTable({
                head: [columns],
                body: export_rows,
                styles: {
                    fontSize: 7,
                    // cellWidth: 150
                    // halign:"center"
                    overflow: 'hidden',
                },
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
                    finalDoc.text('Page ' + data.pageNumber + ' of ' + totalPages, pageWidth - pageNoWidth - rightMargin, pageHeight - 10);
                },
            });

            finalDoc.save('table.pdf');
        },
    };

    //#endregion
    // </editor-fold>
}
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fn: adding tooltip to column header ">
//#region -adding tooltip to column header
function addTooltipToTheColumns(CustomTbrObj, tooltipColumns) {
    tooltipColumns.forEach((opts) => {
        const options = {
            field: null,
            content: null, // if null we will take it from element with attribute tt_for-field="options.field"
            position: 'top',
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
            customClass: options.customClass,
            title: options.content,
            html: true,
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
    return luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');
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
//#region -fn: iGet_el_SelectDropdown
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
function iBS_hideAll_Popovers() {
    $.each($('.popover.show'), function () {
        const popoverToggle = $(`[aria-describedby=${$(this).attr('id')}]`);
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

function debounce(fn, fn_d) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, fn_d);
    };
}

// <editor-fold defaultstate="collapsed" desc=" fn: generate_selectDD_withUniqueList ">
//#region - fn: generate_selectDD_withUniqueList
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
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" COMMENT ">
//#region -COMMENT
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

function createDropdownForTable(options = {}) {
    function customHeaderFilter(headerValue, rowValue, rowData, filterParams) {
        const parentValue = (rowData[filterParams?.filterKey] || '').toLowerCase();
        const searchValue = headerValue?.toLowerCase();

        function isValueExistInChildred(_children) {
            if (!_children) {
                return false;
            }
            return !!_children?.find((data) => (data?.[filterParams?.filterKey] || '').toLowerCase().includes(searchValue));
        }
        return parentValue.includes(searchValue) || isValueExistInChildred(rowData?._children); //must return a boolean, true if it passes the filter.
    }

    var dropdownDiv = $('<div>', {
        class: `dropdown me-2 ${options?.dropdown?.className}`,
    });

    // Create the button with classes and attributes
    var dropdownButton = $('<button>', {
        class: `btn dropdown-toggle border-0`,
        type: 'button',
        id: 'dropdownMenuButton',
        'data-bs-toggle': 'dropdown',
        'aria-expanded': 'false',
        text: options?.dropdown?.title,
    });
    if (options?.dropdown?.style) {
        dropdownButton.css(options?.dropdown?.style);
    }

    // Create the dropdown menu UL element
    var dropdownMenu = $('<ul>', {
        class: `dropdown-menu dds_itemsList_w ${options?.dropdownOptions?.dropdownMenuClass}`,
        id: `${options?.dropdown?.dropdownId}`,
        'aria-labelledby': 'dropdownMenuButton',
    });

    if (options?.dropdownOptions?.style) {
        dropdownMenu.css(options?.dropdownOptions?.style);
    }

    // Append the button and menu to the dropdown div
    dropdownDiv.append(dropdownButton, dropdownMenu);
    const dropdownToggle = $('.dropdown-toggle', $(dropdownDiv));

    dropdownDiv.on('show.bs.dropdown', function () {
        if (!options?.tableInstance) {
            // Only create the table if it doesn't already exist
            options.tableInstance = new Tabulator(`#${options?.dropdown?.dropdownId}`, {
                dataLoaderLoading:
                    "<div style='display:inline-block; border:4px solid #333; border-radius:10px; background:#fff; font-weight:bold; font-size:16px; color:#000; padding:10px 20px;'>Loading Data</div>",
                data: options.data,
                dataTree: true,
                dataTreeChildField: '_children',
                dataTreeStartExpanded: true,
                layout: 'fitData',
                columns: [
                    {
                        field: options?.dropdownOptions?.dropdownField,
                        headerFilter: 'input',
                        sortable: false,
                        headerSort: false,
                        headerFilterPlaceholder: options?.dropdownOptions?.searchPlaceHolder,
                        headerFilterFunc: customHeaderFilter,
                        headerFilterFuncParams: { filterKey: options?.dropdownOptions?.dropdownField },
                        editable: true,
                        resizable: false,
                        width: options.colSize ?? 199,
                    },
                ],
                keybindings: {
                    navDown: true,
                },
                rowFormatter: function (row) {
                    $('.tabulator-cell', row.getElement()).css({
                        padding: '10px',
                    });

                    $(row.getElement())
                        .css({
                            width: '100%',
                            'text-align': 'start',
                            border: '1px solid rgba(0, 0, 0, 0.2)',
                            'background-color': '#fff',
                        })
                        .hover(
                            function () {
                                $(this).css('background-color', '#bbb');
                            },
                            function () {
                                $(this).css('background-color', '#fff');
                            }
                        );

                    if (options?.dropdown?.type !== 'button') {
                        const checkbox = $("<input class='dd_check', type='checkbox' />")
                            .css({
                                'margin-right': '5px',
                            })
                            .on('click', function (e) {
                                checkbox.prop('checked', row.isSelected());
                            });
                        $('.tabulator-cell', row.getElement()).prepend(checkbox);
                    }
                    $(row.getElement()).attr('title', row.getData()[options?.dropdownOptions?.dropdownField]);
                    if (options.classKey && row?.getData?.()?.[options.classKey]) {
                        $(row.getElement()).addClass(row.getData()[options.classKey]);
                    }
                    if (options.styleKey && row?.getData?.()?.[options.styleKey]) {
                        $(row.getElement()).css(row.getData()[options.styleKey]);
                    }
                },
                ...options.tableOptions,
            });

            options?.tableInstance?.on('rowClick', function (e, row) {
                console.log('e', row.getElement());
                e.stopPropagation();
                row.toggleSelect();
                if (options?.dropdown?.type === 'button' || options?.dropdown?.singleSelect) {
                    $('.dd_check', row.getElement()).prop('checked', row.isSelected());
                    options?.tableInstance.getSelectedRows().forEach((srow) => {
                        if (row.getData()[options?.dropdownOptions.id] !== srow.getData()[options?.dropdownOptions.id]) {
                            srow.deselect();
                        }
                        if (options?.dropdown?.type !== 'button') {
                            $('.dd_check', srow.getElement()).prop('checked', srow.isSelected());
                        }
                    });
                    bootstrap.Dropdown.getInstance(dropdownToggle)?.hide();
                } else {
                    $('.dd_check', row.getElement()).prop('checked', row.isSelected());
                }
                if (options?.dropdownOptions?.onDropdownClick) {
                    options.dropdownOptions.onDropdownClick(
                        row,
                        options?.tableInstance?.getSelectedRows(),
                        options?.tableInstance,
                        dropdownDiv
                    );
                }
            });
            options?.tableInstance.on('tableBuilt', () => {
                $('.tabulator-header-filter input', dropdownDiv).addClass('form-control form-control-sm').focus();
                $(`#${options?.dropdown?.dropdownId} .tabulator-tableholder`).css({
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden',
                });
            });
        } else {
            if (options?.shouldRefresh) {
                options?.tableInstance.setData(options?.tableOptions?.ajaxURL || options.data);
            } else {
                options?.tableInstance.scrollToRow(1, 'top', true);
                setTimeout(() => {
                    $('.tabulator-header-filter input', dropdownDiv).focus();
                }, 10);
            }
        }
    });

    dropdownDiv.on('keydown', function (e) {
        const items = dropdownMenu.find('.tabulator-row');
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
                currentItem.removeAttr('data-current').css('background-color', '#fff');

                // Apply the hover effect to the new item, set the data attribute, and scroll into view
                nextItem.attr('data-current', 'true').css('background-color', '#bbb');
                nextItem.get(0).scrollIntoView({ block: 'nearest', inline: 'nearest' });
            }
        } else if (e.key === 'Enter') {
            let currentItem = items.filter('[data-current="true"]');
            if (currentItem?.length) {
                currentItem.click();
            }
        } else if ($(e.target).closest('.tabulator-header-filter')?.length) {
            let currentItem = items.filter('[data-current="true"]');
            currentItem.removeAttr('data-current').css('background-color', '#fff');
        }
    });

    // Append the dropdown div to the body or desired container
    return dropdownDiv;
}
