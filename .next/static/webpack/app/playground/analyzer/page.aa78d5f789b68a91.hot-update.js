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

/***/ "(app-pages-browser)/./components/ab-analyzer/statistics-panel.tsx":
/*!*****************************************************!*\
  !*** ./components/ab-analyzer/statistics-panel.tsx ***!
  \*****************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   StatisticsPanel: function() { return /* binding */ StatisticsPanel; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components_ui_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/components/ui/card */ \"(app-pages-browser)/./components/ui/card.tsx\");\n/* harmony import */ var _components_ui_tabs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/components/ui/tabs */ \"(app-pages-browser)/./components/ui/tabs.tsx\");\n/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/lib/utils */ \"(app-pages-browser)/./lib/utils.ts\");\n/* harmony import */ var _raw_data_table__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./raw-data-table */ \"(app-pages-browser)/./components/ab-analyzer/raw-data-table.tsx\");\n/* __next_internal_client_entry_do_not_use__ StatisticsPanel auto */ \n\n\n\n\n\nfunction StatisticsPanel(param) {\n    let { testData, currency, filters, results, isCollapsed } = param;\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_card__WEBPACK_IMPORTED_MODULE_2__.Card, {\n        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_4__.cn)(\"h-[calc(100vh-200px)]\", \"transition-all duration-300\", \"data-[state=open]:animate-in data-[state=closed]:animate-out\", \"data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0\", \"data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right\", isCollapsed ? \"w-[calc(100%-200px)]\" : \"w-full\"),\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_3__.Tabs, {\n            defaultValue: \"overview\",\n            className: \"h-full flex flex-col\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"flex items-center justify-between border-b px-6 py-4 shrink-0\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_3__.TabsList, {\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_3__.TabsTrigger, {\n                                value: \"overview\",\n                                children: \"Overview\"\n                            }, void 0, false, {\n                                fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/statistics-panel.tsx\",\n                                lineNumber: 42,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_3__.TabsTrigger, {\n                                value: \"engagement\",\n                                children: \"Engagement\"\n                            }, void 0, false, {\n                                fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/statistics-panel.tsx\",\n                                lineNumber: 43,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_3__.TabsTrigger, {\n                                value: \"funnel\",\n                                children: \"Funnel\"\n                            }, void 0, false, {\n                                fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/statistics-panel.tsx\",\n                                lineNumber: 44,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_3__.TabsTrigger, {\n                                value: \"revenue\",\n                                children: \"Revenue\"\n                            }, void 0, false, {\n                                fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/statistics-panel.tsx\",\n                                lineNumber: 45,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_3__.TabsTrigger, {\n                                value: \"raw\",\n                                children: \"Raw\"\n                            }, void 0, false, {\n                                fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/statistics-panel.tsx\",\n                                lineNumber: 46,\n                                columnNumber: 13\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/statistics-panel.tsx\",\n                        lineNumber: 41,\n                        columnNumber: 11\n                    }, this)\n                }, void 0, false, {\n                    fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/statistics-panel.tsx\",\n                    lineNumber: 40,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"flex-1 relative overflow-hidden\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_3__.TabsContent, {\n                            value: \"overview\",\n                            className: \"p-6 absolute inset-0\",\n                            children: \"Overview content\"\n                        }, void 0, false, {\n                            fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/statistics-panel.tsx\",\n                            lineNumber: 51,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_3__.TabsContent, {\n                            value: \"engagement\",\n                            className: \"p-6 absolute inset-0\",\n                            children: \"Engagement content\"\n                        }, void 0, false, {\n                            fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/statistics-panel.tsx\",\n                            lineNumber: 55,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_3__.TabsContent, {\n                            value: \"funnel\",\n                            className: \"p-6 absolute inset-0\",\n                            children: \"Funnel content\"\n                        }, void 0, false, {\n                            fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/statistics-panel.tsx\",\n                            lineNumber: 59,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_3__.TabsContent, {\n                            value: \"revenue\",\n                            className: \"p-6 absolute inset-0\",\n                            children: \"Revenue content\"\n                        }, void 0, false, {\n                            fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/statistics-panel.tsx\",\n                            lineNumber: 63,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tabs__WEBPACK_IMPORTED_MODULE_3__.TabsContent, {\n                            value: \"raw\",\n                            className: \"absolute inset-0\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_raw_data_table__WEBPACK_IMPORTED_MODULE_5__.RawDataTable, {\n                                data: testData,\n                                currency: currency\n                            }, void 0, false, {\n                                fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/statistics-panel.tsx\",\n                                lineNumber: 68,\n                                columnNumber: 13\n                            }, this)\n                        }, void 0, false, {\n                            fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/statistics-panel.tsx\",\n                            lineNumber: 67,\n                            columnNumber: 11\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/statistics-panel.tsx\",\n                    lineNumber: 50,\n                    columnNumber: 9\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/statistics-panel.tsx\",\n            lineNumber: 39,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/jeanrosset/AB-Analyzer/components/ab-analyzer/statistics-panel.tsx\",\n        lineNumber: 29,\n        columnNumber: 5\n    }, this);\n}\n_c = StatisticsPanel;\nvar _c;\n$RefreshReg$(_c, \"StatisticsPanel\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvYWItYW5hbHl6ZXIvc3RhdGlzdGljcy1wYW5lbC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRThCO0FBQ2E7QUFDb0M7QUFFL0M7QUFDZTtBQWF4QyxTQUFTUSxnQkFBZ0IsS0FNVDtRQU5TLEVBQzlCQyxRQUFRLEVBQ1JDLFFBQVEsRUFDUkMsT0FBTyxFQUNQQyxPQUFPLEVBQ1BDLFdBQVcsRUFDVSxHQU5TO0lBTzlCLHFCQUNFLDhEQUFDWixxREFBSUE7UUFDSGEsV0FBV1IsOENBQUVBLENBQ1gseUJBQ0EsK0JBQ0EsZ0VBQ0EsOERBQ0EsZ0ZBQ0FPLGNBQWMseUJBQXlCO2tCQUd6Qyw0RUFBQ1gscURBQUlBO1lBQUNhLGNBQWE7WUFBV0QsV0FBVTs7OEJBQ3RDLDhEQUFDRTtvQkFBSUYsV0FBVTs4QkFDYiw0RUFBQ1YseURBQVFBOzswQ0FDUCw4REFBQ0MsNERBQVdBO2dDQUFDWSxPQUFNOzBDQUFXOzs7Ozs7MENBQzlCLDhEQUFDWiw0REFBV0E7Z0NBQUNZLE9BQU07MENBQWE7Ozs7OzswQ0FDaEMsOERBQUNaLDREQUFXQTtnQ0FBQ1ksT0FBTTswQ0FBUzs7Ozs7OzBDQUM1Qiw4REFBQ1osNERBQVdBO2dDQUFDWSxPQUFNOzBDQUFVOzs7Ozs7MENBQzdCLDhEQUFDWiw0REFBV0E7Z0NBQUNZLE9BQU07MENBQU07Ozs7Ozs7Ozs7Ozs7Ozs7OzhCQUk3Qiw4REFBQ0Q7b0JBQUlGLFdBQVU7O3NDQUNiLDhEQUFDWCw0REFBV0E7NEJBQUNjLE9BQU07NEJBQVdILFdBQVU7c0NBQXVCOzs7Ozs7c0NBSS9ELDhEQUFDWCw0REFBV0E7NEJBQUNjLE9BQU07NEJBQWFILFdBQVU7c0NBQXVCOzs7Ozs7c0NBSWpFLDhEQUFDWCw0REFBV0E7NEJBQUNjLE9BQU07NEJBQVNILFdBQVU7c0NBQXVCOzs7Ozs7c0NBSTdELDhEQUFDWCw0REFBV0E7NEJBQUNjLE9BQU07NEJBQVVILFdBQVU7c0NBQXVCOzs7Ozs7c0NBSTlELDhEQUFDWCw0REFBV0E7NEJBQUNjLE9BQU07NEJBQU1ILFdBQVU7c0NBQ2pDLDRFQUFDUCx5REFBWUE7Z0NBQUNXLE1BQU1UO2dDQUFVQyxVQUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1wRDtLQXJEZ0JGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL2NvbXBvbmVudHMvYWItYW5hbHl6ZXIvc3RhdGlzdGljcy1wYW5lbC50c3g/MzJlNiJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBjbGllbnRcIlxuXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIlxuaW1wb3J0IHsgQ2FyZCB9IGZyb20gXCJAL2NvbXBvbmVudHMvdWkvY2FyZFwiXG5pbXBvcnQgeyBUYWJzLCBUYWJzQ29udGVudCwgVGFic0xpc3QsIFRhYnNUcmlnZ2VyIH0gZnJvbSBcIkAvY29tcG9uZW50cy91aS90YWJzXCJcbmltcG9ydCB7IFNjcm9sbEFyZWEgfSBmcm9tIFwiQC9jb21wb25lbnRzL3VpL3Njcm9sbC1hcmVhXCJcbmltcG9ydCB7IGNuIH0gZnJvbSBcIkAvbGliL3V0aWxzXCJcbmltcG9ydCB7IFJhd0RhdGFUYWJsZSB9IGZyb20gXCIuL3Jhdy1kYXRhLXRhYmxlXCJcblxuaW50ZXJmYWNlIFN0YXRpc3RpY3NQYW5lbFByb3BzIHtcbiAgdGVzdERhdGE6IGFueVxuICBjdXJyZW5jeTogc3RyaW5nXG4gIGZpbHRlcnM6IHtcbiAgICBkZXZpY2VfY2F0ZWdvcnk6IHN0cmluZ1tdXG4gICAgaXRlbV9jYXRlZ29yeTI6IHN0cmluZ1tdXG4gIH1cbiAgcmVzdWx0czogYW55XG4gIGlzQ29sbGFwc2VkOiBib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTdGF0aXN0aWNzUGFuZWwoe1xuICB0ZXN0RGF0YSxcbiAgY3VycmVuY3ksXG4gIGZpbHRlcnMsXG4gIHJlc3VsdHMsXG4gIGlzQ29sbGFwc2VkXG59OiBTdGF0aXN0aWNzUGFuZWxQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxDYXJkIFxuICAgICAgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgXCJoLVtjYWxjKDEwMHZoLTIwMHB4KV1cIiwgLy8gRml4ZWQgaGVpZ2h0IHdpdGggc3BhY2UgZm9yIGhlYWRlclxuICAgICAgICBcInRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTMwMFwiLFxuICAgICAgICBcImRhdGEtW3N0YXRlPW9wZW5dOmFuaW1hdGUtaW4gZGF0YS1bc3RhdGU9Y2xvc2VkXTphbmltYXRlLW91dFwiLFxuICAgICAgICBcImRhdGEtW3N0YXRlPW9wZW5dOmZhZGUtaW4tMCBkYXRhLVtzdGF0ZT1jbG9zZWRdOmZhZGUtb3V0LTBcIixcbiAgICAgICAgXCJkYXRhLVtzdGF0ZT1vcGVuXTpzbGlkZS1pbi1mcm9tLXJpZ2h0IGRhdGEtW3N0YXRlPWNsb3NlZF06c2xpZGUtb3V0LXRvLXJpZ2h0XCIsXG4gICAgICAgIGlzQ29sbGFwc2VkID8gXCJ3LVtjYWxjKDEwMCUtMjAwcHgpXVwiIDogXCJ3LWZ1bGxcIlxuICAgICAgKX1cbiAgICA+XG4gICAgICA8VGFicyBkZWZhdWx0VmFsdWU9XCJvdmVydmlld1wiIGNsYXNzTmFtZT1cImgtZnVsbCBmbGV4IGZsZXgtY29sXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGJvcmRlci1iIHB4LTYgcHktNCBzaHJpbmstMFwiPlxuICAgICAgICAgIDxUYWJzTGlzdD5cbiAgICAgICAgICAgIDxUYWJzVHJpZ2dlciB2YWx1ZT1cIm92ZXJ2aWV3XCI+T3ZlcnZpZXc8L1RhYnNUcmlnZ2VyPlxuICAgICAgICAgICAgPFRhYnNUcmlnZ2VyIHZhbHVlPVwiZW5nYWdlbWVudFwiPkVuZ2FnZW1lbnQ8L1RhYnNUcmlnZ2VyPlxuICAgICAgICAgICAgPFRhYnNUcmlnZ2VyIHZhbHVlPVwiZnVubmVsXCI+RnVubmVsPC9UYWJzVHJpZ2dlcj5cbiAgICAgICAgICAgIDxUYWJzVHJpZ2dlciB2YWx1ZT1cInJldmVudWVcIj5SZXZlbnVlPC9UYWJzVHJpZ2dlcj5cbiAgICAgICAgICAgIDxUYWJzVHJpZ2dlciB2YWx1ZT1cInJhd1wiPlJhdzwvVGFic1RyaWdnZXI+XG4gICAgICAgICAgPC9UYWJzTGlzdD5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgcmVsYXRpdmUgb3ZlcmZsb3ctaGlkZGVuXCI+XG4gICAgICAgICAgPFRhYnNDb250ZW50IHZhbHVlPVwib3ZlcnZpZXdcIiBjbGFzc05hbWU9XCJwLTYgYWJzb2x1dGUgaW5zZXQtMFwiPlxuICAgICAgICAgICAgT3ZlcnZpZXcgY29udGVudFxuICAgICAgICAgIDwvVGFic0NvbnRlbnQ+XG5cbiAgICAgICAgICA8VGFic0NvbnRlbnQgdmFsdWU9XCJlbmdhZ2VtZW50XCIgY2xhc3NOYW1lPVwicC02IGFic29sdXRlIGluc2V0LTBcIj5cbiAgICAgICAgICAgIEVuZ2FnZW1lbnQgY29udGVudFxuICAgICAgICAgIDwvVGFic0NvbnRlbnQ+XG5cbiAgICAgICAgICA8VGFic0NvbnRlbnQgdmFsdWU9XCJmdW5uZWxcIiBjbGFzc05hbWU9XCJwLTYgYWJzb2x1dGUgaW5zZXQtMFwiPlxuICAgICAgICAgICAgRnVubmVsIGNvbnRlbnRcbiAgICAgICAgICA8L1RhYnNDb250ZW50PlxuXG4gICAgICAgICAgPFRhYnNDb250ZW50IHZhbHVlPVwicmV2ZW51ZVwiIGNsYXNzTmFtZT1cInAtNiBhYnNvbHV0ZSBpbnNldC0wXCI+XG4gICAgICAgICAgICBSZXZlbnVlIGNvbnRlbnRcbiAgICAgICAgICA8L1RhYnNDb250ZW50PlxuXG4gICAgICAgICAgPFRhYnNDb250ZW50IHZhbHVlPVwicmF3XCIgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMFwiPlxuICAgICAgICAgICAgPFJhd0RhdGFUYWJsZSBkYXRhPXt0ZXN0RGF0YX0gY3VycmVuY3k9e2N1cnJlbmN5fSAvPlxuICAgICAgICAgIDwvVGFic0NvbnRlbnQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9UYWJzPlxuICAgIDwvQ2FyZD5cbiAgKVxufSJdLCJuYW1lcyI6WyJSZWFjdCIsIkNhcmQiLCJUYWJzIiwiVGFic0NvbnRlbnQiLCJUYWJzTGlzdCIsIlRhYnNUcmlnZ2VyIiwiY24iLCJSYXdEYXRhVGFibGUiLCJTdGF0aXN0aWNzUGFuZWwiLCJ0ZXN0RGF0YSIsImN1cnJlbmN5IiwiZmlsdGVycyIsInJlc3VsdHMiLCJpc0NvbGxhcHNlZCIsImNsYXNzTmFtZSIsImRlZmF1bHRWYWx1ZSIsImRpdiIsInZhbHVlIiwiZGF0YSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/ab-analyzer/statistics-panel.tsx\n"));

/***/ })

});