/**
 *
 */
Ext.define('MySQLink.ux.QueryEditor', {
    extend: 'Ext.panel.Panel',
    requires: [],
    xtype: 'query-editor',
    initComponent: function (config) {
        Ext.applyIf(this, {
            host: '',
            db: '',
            sql: ''
        });

        var list = [
            {"text": "[none]", "value": ""}
        ];
        for (var i = 0; i < this.dbList.length; i++) {
            list.push({"text": this.dbList[i], "value": this.dbList[i]});
        }
        ;
        this.dbList = list;

        this.createEditor();
        this.createToolBar();
        this.createTabPanel();
        this.createStatusBar();
        config = Ext.apply(this, {
            layout: 'border',
            height: '100%',
            border: false,
            enableHdMenu: true,
            bodyStyle: {
                'border-top-width': '0px'
            },
            items: [this.editor, this.tabPanel]
        });
        this.callParent();
    },
    getQuery: function () {
        return this.editor.getQuery();
    },
    getSelectedDB: function () {
        //return this.combo.getValue();
        return this.db;
    },
    execute: function () {
        var query = this.getQuery(),
            db = this.getSelectedDB();
        this.tabPanel.getEl().mask('Loading...', 'x-mask-loading');
        Ext.Ajax.request({
            scope: this,
            url: executeURL, //defined in index :(
            params: {
                host: this.host,
                query: query,
                db: this.db
            },
            success: function (resp, opts) {
                var response = Ext.JSON.decode(resp.responseText);
                //remove all tabs but 'Message' tab
                var c = this.tabPanel.getComponent(1)
                while (c) {
                    this.tabPanel.remove(c, true);
                    c = this.tabPanel.getComponent(1)
                }
                //set Message tab body
                //this.tabPanel.getComponent(0).getEl().down('div').setHTML(response.msg);
                this.outputGrid.getStore().loadData([response.msg], true);
                /*this.tabPanel.removeAll(true);
                 this.tabPanel.add({
                 title: "Message",
                 closable: false,
                 html: response.msg
                 }).show();*/
                if (response.results) {
                    for (var i = 0; i < response.results.length; i++) {
                        var resultGrid = Ext.create('MySQLink.ux.QueryGrid', {
                            title: 'Result ' + (i + 1),
                            closable: true
                        });
                        this.tabPanel.add(resultGrid).show(); //
                        resultGrid.loadData(response.results[i]);
                    }
                }
                var bbar = this.getDockedItems('toolbar[dock="bottom"]')[0];
                bbar.setText(response.msg.status);
                bbar.statusEl.el.highlight();
                this.tabPanel.getEl().unmask();
            },
            failure: function () {
                this.tabPanel.getEl().unmask();
            }
        });
    },
    createToolBar: function () {
        var yo = this;
        // Db combobox
        var dbStore = Ext.create('Ext.data.Store', {
            fields: ['text', 'value'],
            data: this.dbList
        });
        var dbCombo = Ext.create('Ext.form.ComboBox', {
            editable: false,
            scope: yo,
            forceSelection: true,
            value: dbStore.getAt(0),
            store: dbStore,
            queryMode: 'local',
            displayField: 'text',
            valueField: 'value',
            listeners: {
                change: {
                    fn: function (me, newValue, oldValue, eOpts) {
                        this.db = newValue;
                    },
                    scope: yo
                }
            }
        });
        var toolbar = new Ext.Toolbar({
            defaults: {scope: yo},
            layout: {
                overflowHandler: 'Menu'
            },
            items: [dbCombo, {
                text: 'Execute',
                iconCls: 'app-icon-run-script',
                handler: this.execute
            }
            ]
        });
        /*var cmToolbar = this.editor.getDockedItems('toolbar[dock="top"]')[0];
         cmToolbar.insert(0,dbCombo);
         cmToolbar.insert(1,{
         text: 'Execute',
         iconCls: 'app-icon-run-script',
         handler: this.execute
         });*/
        this.tbar = toolbar;
    },

    createEditor: function () {
        this.editor = Ext.create('MySQLink.CodeMirror', {
            sql: this.sql,
            region: 'north',
            split: true,
            bodyStyle: {
                'border-left-width': '0px',
                //'border-top-width': '0px',
                'border-right-width': '0px'
            },
            layout: 'fit',
            height: '50%'
        });
    },

    createTabPanel: function () {
        this.outputGrid = this.createOutputGrid();
        this.tabPanel = Ext.create('Ext.tab.Panel', {
            //plugins : Ext.create('Ext.ux.BoxReorderer', {}),
            activeTab: 0,
            split: true,
            region: 'center',
            //border:false,
            headerStyle: {
                "border-top-width": "1px"
            },
            bodyStyle: {
                'border-left-width': '0px',
                'border-top-width': '1px',
                'border-bottom-width': '0px',
                'border-right-width': '0px'
            },
            defaults: { // defaults are applied to items, not the container
                closable: true,
                reorderable: true,
                border: false
            },
            items: [this.outputGrid/*,
             {
             title: "Message",
             //html: 'sb fbsljgdsf doa    aofaof aof oaf aof of aof oa foa ',
             bodyStyle: {
             //background: '#ffc',
             padding: '20px'
             },
             closable: false
             }*/
            ]
        });
    },
    createGrid: function () {
        this.grid = new MySQLink.Grid({
            layout: 'fit',
            split: true,
            region: 'center',
            border: false,
            bodyStyle: 'border-top-width: 1px;'
        });
    },
    createStatusBar: function () {
        this.bbar = new Ext.ux.StatusBar({
            text: 'Ready',
            iconCls: 'x-status-valid'
        });
    },
    createOutputGrid: function () {
        var me = this;
        var store = Ext.create('Ext.data.Store', {
            fields: ['status', 'time', 'msg', 'duration'],
            data: []
        });
        return Ext.create('Ext.grid.Panel', {
            title: 'Output',
            store: store,
            //forceFit: true,
            tbar: [
                {
                    xtype: 'button',
                    text: 'Clear output',
                    iconCls: 'app-icon-delete',
                    scope: this,
                    handler: function () {
                        this.outputGrid.getStore().removeAll();
                    }
                }
            ],
            columns: [
                { xtype: 'rownumberer', width: 25, maxWidth: 30},
                {
                    text: 'Status',
                    width: 50,
                    maxWidth: 50,
                    renderer: function (val) {
                        if (val == 'ERROR') {
                            return '<img alt="" src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" class="x-action-col-icon app-icon-center-column-grid app-icon-error" >'
                        }
                        if (val == 'OK') {
                            return '<img alt="" src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" class="x-action-col-icon app-icon-center-column-grid app-icon-ok" >'
                        }
                        return val;
                    },
                    dataIndex: 'status'
                },
                { text: 'Time', dataIndex: 'time', width: 170, maxWidth: 170},
                { text: 'Message', dataIndex: 'msg', flex: 1},
                { text: 'Duration', dataIndex: 'duration', width: 170, maxWidth: 170 }
            ]
        });
    }
});
