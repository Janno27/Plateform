"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/playground/analyzer/page",{

/***/ "(app-pages-browser)/./components/ab-analyzer/raw-data-table.tsx":
/*!***************************************************!*\
  !*** ./components/ab-analyzer/raw-data-table.tsx ***!
  \***************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   RawDataTable: function() { return /* binding */ RawDataTable; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components_ui_table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/components/ui/table */ \"(app-pages-browser)/./components/ui/table.tsx\");\n/* harmony import */ var _components_ui_switch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/components/ui/switch */ \"(app-pages-browser)/./components/ui/switch.tsx\");\n/* harmony import */ var _components_ui_label__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/components/ui/label */ \"(app-pages-browser)/./components/ui/label.tsx\");\n/* __next_internal_client_entry_do_not_use__ RawDataTable auto */ \nvar _s = $RefreshSig$();\n\n\n\n\nfunction RawDataTable(param) {\n    let { data, currency } = param;\n    _s();\n    const [showTransactions, setShowTransactions] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);\n    // Sécuriser l'accès aux données\n    const rawData = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(()=>{\n        var _data_analysisData;\n        if (!(data === null || data === void 0 ? void 0 : (_data_analysisData = data.analysisData) === null || _data_analysisData === void 0 ? void 0 : _data_analysisData.raw_data)) return {\n            overall: [],\n            transaction: []\n        };\n        return {\n            overall: data.analysisData.raw_data.overall || [],\n            transaction: data.analysisData.raw_data.transaction || []\n        };\n    }, [\n        data\n    ]);\n    // Obtenir les colonnes de manière sécurisée\n    const columns = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(()=>{\n        const currentData = showTransactions ? rawData.transaction : rawData.overall;\n        if (!currentData.length) return [];\n        return Object.keys(currentData[0] || {});\n    }, [\n        rawData,\n        showTransactions\n    ]);\n    // Formater les valeurs selon leur type\n    const formatValue = (value)=>{\n        if (typeof value === \"number\") {\n            if (columns.includes(\"revenue\") && value > 1000) {\n                return \"\".concat(currency, \" \").concat(value.toLocaleString(undefined, {\n                    minimumFractionDigits: 2,\n                    maximumFractionDigits: 2\n                }));\n            }\n            return value.toLocaleString();\n        }\n        return value;\n    };\n    if (!rawData.overall.length && !rawData.transaction.length) {\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"text-center py-8 text-muted-foreground\",\n            children: \"No data available\"\n        }, void 0, false, {\n            fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/raw-data-table.tsx\",\n            lineNumber: 55,\n            columnNumber: 7\n        }, this);\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"space-y-4\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex items-center justify-between px-6\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"flex items-center space-x-2\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_switch__WEBPACK_IMPORTED_MODULE_3__.Switch, {\n                                id: \"show-transactions\",\n                                checked: showTransactions,\n                                onCheckedChange: setShowTransactions,\n                                disabled: !rawData.transaction.length\n                            }, void 0, false, {\n                                fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/raw-data-table.tsx\",\n                                lineNumber: 65,\n                                columnNumber: 11\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_label__WEBPACK_IMPORTED_MODULE_4__.Label, {\n                                htmlFor: \"show-transactions\",\n                                children: showTransactions ? \"Transaction Data\" : \"Overall Data\"\n                            }, void 0, false, {\n                                fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/raw-data-table.tsx\",\n                                lineNumber: 71,\n                                columnNumber: 11\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/raw-data-table.tsx\",\n                        lineNumber: 64,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"text-sm text-muted-foreground\",\n                        children: showTransactions ? \"\".concat(rawData.transaction.length, \" transactions\") : \"\".concat(rawData.overall.length, \" records\")\n                    }, void 0, false, {\n                        fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/raw-data-table.tsx\",\n                        lineNumber: 75,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/raw-data-table.tsx\",\n                lineNumber: 63,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"rounded-lg border\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_table__WEBPACK_IMPORTED_MODULE_2__.Table, {\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_table__WEBPACK_IMPORTED_MODULE_2__.TableHeader, {\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_table__WEBPACK_IMPORTED_MODULE_2__.TableRow, {\n                                children: columns.map((column)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_table__WEBPACK_IMPORTED_MODULE_2__.TableHead, {\n                                        className: \"whitespace-nowrap\",\n                                        children: column.replace(/_/g, \" \").replace(/\\b\\w/g, (l)=>l.toUpperCase())\n                                    }, column, false, {\n                                        fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/raw-data-table.tsx\",\n                                        lineNumber: 88,\n                                        columnNumber: 17\n                                    }, this))\n                            }, void 0, false, {\n                                fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/raw-data-table.tsx\",\n                                lineNumber: 86,\n                                columnNumber: 13\n                            }, this)\n                        }, void 0, false, {\n                            fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/raw-data-table.tsx\",\n                            lineNumber: 85,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_table__WEBPACK_IMPORTED_MODULE_2__.TableBody, {\n                            children: (showTransactions ? rawData.transaction : rawData.overall).slice(0, 100) // Limiter à 100 lignes pour la performance\n                            .map((row, index)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_table__WEBPACK_IMPORTED_MODULE_2__.TableRow, {\n                                    children: columns.map((column)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_table__WEBPACK_IMPORTED_MODULE_2__.TableCell, {\n                                            children: formatValue(row[column])\n                                        }, column, false, {\n                                            fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/raw-data-table.tsx\",\n                                            lineNumber: 100,\n                                            columnNumber: 21\n                                        }, this))\n                                }, index, false, {\n                                    fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/raw-data-table.tsx\",\n                                    lineNumber: 98,\n                                    columnNumber: 17\n                                }, this))\n                        }, void 0, false, {\n                            fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/raw-data-table.tsx\",\n                            lineNumber: 94,\n                            columnNumber: 11\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/raw-data-table.tsx\",\n                    lineNumber: 84,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/raw-data-table.tsx\",\n                lineNumber: 83,\n                columnNumber: 7\n            }, this),\n            (showTransactions ? rawData.transaction : rawData.overall).length > 100 && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"text-center text-sm text-muted-foreground px-6 pb-4\",\n                children: [\n                    \"Showing first 100 records of \",\n                    showTransactions ? rawData.transaction.length : rawData.overall.length\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/raw-data-table.tsx\",\n                lineNumber: 111,\n                columnNumber: 9\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/raw-data-table.tsx\",\n        lineNumber: 62,\n        columnNumber: 5\n    }, this);\n}\n_s(RawDataTable, \"hGTYYs3QCns2S7MRMqmkuu+toKc=\");\n_c = RawDataTable;\nvar _c;\n$RefreshReg$(_c, \"RawDataTable\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvYWItYW5hbHl6ZXIvcmF3LWRhdGEtdGFibGUudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUU4QjtBQVFBO0FBQ2lCO0FBQ0Y7QUFPdEMsU0FBU1MsYUFBYSxLQUFxQztRQUFyQyxFQUFFQyxJQUFJLEVBQUVDLFFBQVEsRUFBcUIsR0FBckM7O0lBQzNCLE1BQU0sQ0FBQ0Msa0JBQWtCQyxvQkFBb0IsR0FBR2IsMkNBQWMsQ0FBQztJQUUvRCxnQ0FBZ0M7SUFDaEMsTUFBTWUsVUFBVWYsMENBQWEsQ0FBQztZQUN2QlU7UUFBTCxJQUFJLEVBQUNBLGlCQUFBQSw0QkFBQUEscUJBQUFBLEtBQU1PLFlBQVksY0FBbEJQLHlDQUFBQSxtQkFBb0JRLFFBQVEsR0FBRSxPQUFPO1lBQUVDLFNBQVMsRUFBRTtZQUFFQyxhQUFhLEVBQUU7UUFBQztRQUN6RSxPQUFPO1lBQ0xELFNBQVNULEtBQUtPLFlBQVksQ0FBQ0MsUUFBUSxDQUFDQyxPQUFPLElBQUksRUFBRTtZQUNqREMsYUFBYVYsS0FBS08sWUFBWSxDQUFDQyxRQUFRLENBQUNFLFdBQVcsSUFBSSxFQUFFO1FBQzNEO0lBQ0YsR0FBRztRQUFDVjtLQUFLO0lBRVQsNENBQTRDO0lBQzVDLE1BQU1XLFVBQVVyQiwwQ0FBYSxDQUFDO1FBQzVCLE1BQU1zQixjQUFjVixtQkFBbUJHLFFBQVFLLFdBQVcsR0FBR0wsUUFBUUksT0FBTztRQUM1RSxJQUFJLENBQUNHLFlBQVlDLE1BQU0sRUFBRSxPQUFPLEVBQUU7UUFDbEMsT0FBT0MsT0FBT0MsSUFBSSxDQUFDSCxXQUFXLENBQUMsRUFBRSxJQUFJLENBQUM7SUFDeEMsR0FBRztRQUFDUDtRQUFTSDtLQUFpQjtJQUU5Qix1Q0FBdUM7SUFDdkMsTUFBTWMsY0FBYyxDQUFDQztRQUNuQixJQUFJLE9BQU9BLFVBQVUsVUFBVTtZQUM3QixJQUFJTixRQUFRTyxRQUFRLENBQUMsY0FBY0QsUUFBUSxNQUFNO2dCQUMvQyxPQUFPLEdBQWVBLE9BQVpoQixVQUFTLEtBR2hCLE9BSG1CZ0IsTUFBTUUsY0FBYyxDQUFDQyxXQUFXO29CQUNwREMsdUJBQXVCO29CQUN2QkMsdUJBQXVCO2dCQUN6QjtZQUNGO1lBQ0EsT0FBT0wsTUFBTUUsY0FBYztRQUM3QjtRQUNBLE9BQU9GO0lBQ1Q7SUFFQSxJQUFJLENBQUNaLFFBQVFJLE9BQU8sQ0FBQ0ksTUFBTSxJQUFJLENBQUNSLFFBQVFLLFdBQVcsQ0FBQ0csTUFBTSxFQUFFO1FBQzFELHFCQUNFLDhEQUFDVTtZQUFJQyxXQUFVO3NCQUF5Qzs7Ozs7O0lBSTVEO0lBRUEscUJBQ0UsOERBQUNEO1FBQUlDLFdBQVU7OzBCQUNiLDhEQUFDRDtnQkFBSUMsV0FBVTs7a0NBQ2IsOERBQUNEO3dCQUFJQyxXQUFVOzswQ0FDYiw4REFBQzNCLHlEQUFNQTtnQ0FDTDRCLElBQUc7Z0NBQ0hDLFNBQVN4QjtnQ0FDVHlCLGlCQUFpQnhCO2dDQUNqQnlCLFVBQVUsQ0FBQ3ZCLFFBQVFLLFdBQVcsQ0FBQ0csTUFBTTs7Ozs7OzBDQUV2Qyw4REFBQ2YsdURBQUtBO2dDQUFDK0IsU0FBUTswQ0FDWjNCLG1CQUFtQixxQkFBcUI7Ozs7Ozs7Ozs7OztrQ0FHN0MsOERBQUNxQjt3QkFBSUMsV0FBVTtrQ0FDWnRCLG1CQUNHLEdBQThCLE9BQTNCRyxRQUFRSyxXQUFXLENBQUNHLE1BQU0sRUFBQyxtQkFDOUIsR0FBMEIsT0FBdkJSLFFBQVFJLE9BQU8sQ0FBQ0ksTUFBTSxFQUFDOzs7Ozs7Ozs7Ozs7MEJBS2xDLDhEQUFDVTtnQkFBSUMsV0FBVTswQkFDYiw0RUFBQ2pDLHVEQUFLQTs7c0NBQ0osOERBQUNJLDZEQUFXQTtzQ0FDViw0RUFBQ0MsMERBQVFBOzBDQUNOZSxRQUFRbUIsR0FBRyxDQUFDQyxDQUFBQSx1QkFDWCw4REFBQ3JDLDJEQUFTQTt3Q0FBYzhCLFdBQVU7a0RBQy9CTyxPQUFPQyxPQUFPLENBQUMsTUFBTSxLQUFLQSxPQUFPLENBQUMsU0FBU0MsQ0FBQUEsSUFBS0EsRUFBRUMsV0FBVzt1Q0FEaERIOzs7Ozs7Ozs7Ozs7Ozs7c0NBTXRCLDhEQUFDdkMsMkRBQVNBO3NDQUNQLENBQUNVLG1CQUFtQkcsUUFBUUssV0FBVyxHQUFHTCxRQUFRSSxPQUFPLEVBQ3ZEMEIsS0FBSyxDQUFDLEdBQUcsS0FBSywyQ0FBMkM7NkJBQ3pETCxHQUFHLENBQUMsQ0FBQ00sS0FBVUMsc0JBQ2QsOERBQUN6QywwREFBUUE7OENBQ05lLFFBQVFtQixHQUFHLENBQUNDLENBQUFBLHVCQUNYLDhEQUFDdEMsMkRBQVNBO3NEQUNQdUIsWUFBWW9CLEdBQUcsQ0FBQ0wsT0FBTzsyQ0FEVkE7Ozs7O21DQUZMTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBWXZCbkMsQ0FBQUEsbUJBQW1CRyxRQUFRSyxXQUFXLEdBQUdMLFFBQVFJLE9BQU8sRUFBRUksTUFBTSxHQUFHLHFCQUNuRSw4REFBQ1U7Z0JBQUlDLFdBQVU7O29CQUFzRDtvQkFFakV0QixtQkFBbUJHLFFBQVFLLFdBQVcsQ0FBQ0csTUFBTSxHQUFHUixRQUFRSSxPQUFPLENBQUNJLE1BQU07Ozs7Ozs7Ozs7Ozs7QUFNbEY7R0FuR2dCZDtLQUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9jb21wb25lbnRzL2FiLWFuYWx5emVyL3Jhdy1kYXRhLXRhYmxlLnRzeD9jNTg3Il0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGNsaWVudFwiXG5cbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiXG5pbXBvcnQge1xuICBUYWJsZSxcbiAgVGFibGVCb2R5LFxuICBUYWJsZUNlbGwsXG4gIFRhYmxlSGVhZCxcbiAgVGFibGVIZWFkZXIsXG4gIFRhYmxlUm93LFxufSBmcm9tIFwiQC9jb21wb25lbnRzL3VpL3RhYmxlXCJcbmltcG9ydCB7IFN3aXRjaCB9IGZyb20gXCJAL2NvbXBvbmVudHMvdWkvc3dpdGNoXCJcbmltcG9ydCB7IExhYmVsIH0gZnJvbSBcIkAvY29tcG9uZW50cy91aS9sYWJlbFwiXG5cbmludGVyZmFjZSBSYXdEYXRhVGFibGVQcm9wcyB7XG4gIGRhdGE6IGFueVxuICBjdXJyZW5jeTogc3RyaW5nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSYXdEYXRhVGFibGUoeyBkYXRhLCBjdXJyZW5jeSB9OiBSYXdEYXRhVGFibGVQcm9wcykge1xuICBjb25zdCBbc2hvd1RyYW5zYWN0aW9ucywgc2V0U2hvd1RyYW5zYWN0aW9uc10gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSlcblxuICAvLyBTw6ljdXJpc2VyIGwnYWNjw6hzIGF1eCBkb25uw6llc1xuICBjb25zdCByYXdEYXRhID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFkYXRhPy5hbmFseXNpc0RhdGE/LnJhd19kYXRhKSByZXR1cm4geyBvdmVyYWxsOiBbXSwgdHJhbnNhY3Rpb246IFtdIH1cbiAgICByZXR1cm4ge1xuICAgICAgb3ZlcmFsbDogZGF0YS5hbmFseXNpc0RhdGEucmF3X2RhdGEub3ZlcmFsbCB8fCBbXSxcbiAgICAgIHRyYW5zYWN0aW9uOiBkYXRhLmFuYWx5c2lzRGF0YS5yYXdfZGF0YS50cmFuc2FjdGlvbiB8fCBbXVxuICAgIH1cbiAgfSwgW2RhdGFdKVxuXG4gIC8vIE9idGVuaXIgbGVzIGNvbG9ubmVzIGRlIG1hbmnDqHJlIHPDqWN1cmlzw6llXG4gIGNvbnN0IGNvbHVtbnMgPSBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBjdXJyZW50RGF0YSA9IHNob3dUcmFuc2FjdGlvbnMgPyByYXdEYXRhLnRyYW5zYWN0aW9uIDogcmF3RGF0YS5vdmVyYWxsXG4gICAgaWYgKCFjdXJyZW50RGF0YS5sZW5ndGgpIHJldHVybiBbXVxuICAgIHJldHVybiBPYmplY3Qua2V5cyhjdXJyZW50RGF0YVswXSB8fCB7fSlcbiAgfSwgW3Jhd0RhdGEsIHNob3dUcmFuc2FjdGlvbnNdKVxuXG4gIC8vIEZvcm1hdGVyIGxlcyB2YWxldXJzIHNlbG9uIGxldXIgdHlwZVxuICBjb25zdCBmb3JtYXRWYWx1ZSA9ICh2YWx1ZTogYW55KSA9PiB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGlmIChjb2x1bW5zLmluY2x1ZGVzKCdyZXZlbnVlJykgJiYgdmFsdWUgPiAxMDAwKSB7XG4gICAgICAgIHJldHVybiBgJHtjdXJyZW5jeX0gJHt2YWx1ZS50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcbiAgICAgICAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXG4gICAgICAgICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyXG4gICAgICAgIH0pfWBcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZS50b0xvY2FsZVN0cmluZygpXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgaWYgKCFyYXdEYXRhLm92ZXJhbGwubGVuZ3RoICYmICFyYXdEYXRhLnRyYW5zYWN0aW9uLmxlbmd0aCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyIHB5LTggdGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCI+XG4gICAgICAgIE5vIGRhdGEgYXZhaWxhYmxlXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBweC02XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgc3BhY2UteC0yXCI+XG4gICAgICAgICAgPFN3aXRjaFxuICAgICAgICAgICAgaWQ9XCJzaG93LXRyYW5zYWN0aW9uc1wiXG4gICAgICAgICAgICBjaGVja2VkPXtzaG93VHJhbnNhY3Rpb25zfVxuICAgICAgICAgICAgb25DaGVja2VkQ2hhbmdlPXtzZXRTaG93VHJhbnNhY3Rpb25zfVxuICAgICAgICAgICAgZGlzYWJsZWQ9eyFyYXdEYXRhLnRyYW5zYWN0aW9uLmxlbmd0aH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxMYWJlbCBodG1sRm9yPVwic2hvdy10cmFuc2FjdGlvbnNcIj5cbiAgICAgICAgICAgIHtzaG93VHJhbnNhY3Rpb25zID8gJ1RyYW5zYWN0aW9uIERhdGEnIDogJ092ZXJhbGwgRGF0YSd9XG4gICAgICAgICAgPC9MYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LW11dGVkLWZvcmVncm91bmRcIj5cbiAgICAgICAgICB7c2hvd1RyYW5zYWN0aW9ucyBcbiAgICAgICAgICAgID8gYCR7cmF3RGF0YS50cmFuc2FjdGlvbi5sZW5ndGh9IHRyYW5zYWN0aW9uc2BcbiAgICAgICAgICAgIDogYCR7cmF3RGF0YS5vdmVyYWxsLmxlbmd0aH0gcmVjb3Jkc2BcbiAgICAgICAgICB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC1sZyBib3JkZXJcIj5cbiAgICAgICAgPFRhYmxlPlxuICAgICAgICAgIDxUYWJsZUhlYWRlcj5cbiAgICAgICAgICAgIDxUYWJsZVJvdz5cbiAgICAgICAgICAgICAge2NvbHVtbnMubWFwKGNvbHVtbiA9PiAoXG4gICAgICAgICAgICAgICAgPFRhYmxlSGVhZCBrZXk9e2NvbHVtbn0gY2xhc3NOYW1lPVwid2hpdGVzcGFjZS1ub3dyYXBcIj5cbiAgICAgICAgICAgICAgICAgIHtjb2x1bW4ucmVwbGFjZSgvXy9nLCAnICcpLnJlcGxhY2UoL1xcYlxcdy9nLCBsID0+IGwudG9VcHBlckNhc2UoKSl9XG4gICAgICAgICAgICAgICAgPC9UYWJsZUhlYWQ+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9UYWJsZVJvdz5cbiAgICAgICAgICA8L1RhYmxlSGVhZGVyPlxuICAgICAgICAgIDxUYWJsZUJvZHk+XG4gICAgICAgICAgICB7KHNob3dUcmFuc2FjdGlvbnMgPyByYXdEYXRhLnRyYW5zYWN0aW9uIDogcmF3RGF0YS5vdmVyYWxsKVxuICAgICAgICAgICAgICAuc2xpY2UoMCwgMTAwKSAvLyBMaW1pdGVyIMOgIDEwMCBsaWduZXMgcG91ciBsYSBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgICAubWFwKChyb3c6IGFueSwgaW5kZXg6IG51bWJlcikgPT4gKFxuICAgICAgICAgICAgICAgIDxUYWJsZVJvdyBrZXk9e2luZGV4fT5cbiAgICAgICAgICAgICAgICAgIHtjb2x1bW5zLm1hcChjb2x1bW4gPT4gKFxuICAgICAgICAgICAgICAgICAgICA8VGFibGVDZWxsIGtleT17Y29sdW1ufT5cbiAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0VmFsdWUocm93W2NvbHVtbl0pfVxuICAgICAgICAgICAgICAgICAgICA8L1RhYmxlQ2VsbD5cbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDwvVGFibGVSb3c+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvVGFibGVCb2R5PlxuICAgICAgICA8L1RhYmxlPlxuICAgICAgPC9kaXY+XG4gICAgICBcbiAgICAgIHsoc2hvd1RyYW5zYWN0aW9ucyA/IHJhd0RhdGEudHJhbnNhY3Rpb24gOiByYXdEYXRhLm92ZXJhbGwpLmxlbmd0aCA+IDEwMCAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgdGV4dC1zbSB0ZXh0LW11dGVkLWZvcmVncm91bmQgcHgtNiBwYi00XCI+XG4gICAgICAgICAgU2hvd2luZyBmaXJzdCAxMDAgcmVjb3JkcyBvZiB7XG4gICAgICAgICAgICBzaG93VHJhbnNhY3Rpb25zID8gcmF3RGF0YS50cmFuc2FjdGlvbi5sZW5ndGggOiByYXdEYXRhLm92ZXJhbGwubGVuZ3RoXG4gICAgICAgICAgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gIClcbn0iXSwibmFtZXMiOlsiUmVhY3QiLCJUYWJsZSIsIlRhYmxlQm9keSIsIlRhYmxlQ2VsbCIsIlRhYmxlSGVhZCIsIlRhYmxlSGVhZGVyIiwiVGFibGVSb3ciLCJTd2l0Y2giLCJMYWJlbCIsIlJhd0RhdGFUYWJsZSIsImRhdGEiLCJjdXJyZW5jeSIsInNob3dUcmFuc2FjdGlvbnMiLCJzZXRTaG93VHJhbnNhY3Rpb25zIiwidXNlU3RhdGUiLCJyYXdEYXRhIiwidXNlTWVtbyIsImFuYWx5c2lzRGF0YSIsInJhd19kYXRhIiwib3ZlcmFsbCIsInRyYW5zYWN0aW9uIiwiY29sdW1ucyIsImN1cnJlbnREYXRhIiwibGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsImZvcm1hdFZhbHVlIiwidmFsdWUiLCJpbmNsdWRlcyIsInRvTG9jYWxlU3RyaW5nIiwidW5kZWZpbmVkIiwibWluaW11bUZyYWN0aW9uRGlnaXRzIiwibWF4aW11bUZyYWN0aW9uRGlnaXRzIiwiZGl2IiwiY2xhc3NOYW1lIiwiaWQiLCJjaGVja2VkIiwib25DaGVja2VkQ2hhbmdlIiwiZGlzYWJsZWQiLCJodG1sRm9yIiwibWFwIiwiY29sdW1uIiwicmVwbGFjZSIsImwiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwicm93IiwiaW5kZXgiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/ab-analyzer/raw-data-table.tsx\n"));

/***/ })

});