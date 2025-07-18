const HTML_cell_FormatSortExport_manager = () => {
    return {
        sorter: function (a, b, aRow, bRow, column) {
            return HtmlToString(a).localeCompare(HtmlToString(b));
        },
        formatter: function (cell, formatterParams, onRendered) {
            return HtmlToString(cell.getValue());
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