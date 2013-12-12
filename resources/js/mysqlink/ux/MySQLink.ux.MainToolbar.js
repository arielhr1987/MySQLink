/**
 *
 */

Ext.define('MySQLink.ux.MainToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    requires: [
        'Ext.toolbar.*'
    ],
    xtype: 'main-toolbar',
    initComponent: function () {

        Ext.apply(this, {
            border: false,
            defaults: {
                scope: this
            },
            items: [
                {
                    text: 'Server monitor',
                    iconCls: 'app-icon-server-monitor',
                    handler: function () {
                        this.addTab({
                            title: 'Server monitor',
                            closable: true,
                            iconCls: 'app-icon-server-monitor',
                            src: 'http://localhost/MySQLink/Simple/server'
                        });
                    }
                },
                {
                    text: 'Query Editor',
                    iconCls: 'app-icon-query-editor',
                    handler: function () {
                        this.addTab(
                            {
                                title: 'Query Editor',
                                closable: true,
                                iconCls: 'app-icon-query-editor',
                                src: 'http://localhost/MySQLink/Simple/Query/Index/localhost'
                            }
                        );
                    }
                },
                {
                    text: 'Procedures',
                    iconCls: 'app-icon-procedure',
                    handler: function () {
                        this.addTab(
                            {
                                title: 'Procedure list',
                                closable: true,
                                iconCls: 'app-icon-procedure',
                                src: 'http://localhost/MySQLink/Simple/Procedure/Index/localhost/mysqlinktest'
                            }
                        );
                    }
                },
                {
                    text: 'Functions',
                    iconCls: 'app-icon-function',
                    handler: function () {
                        this.addTab(
                            {
                                title: 'Function list',
                                closable: true,
                                iconCls: 'app-icon-function',
                                src: 'http://localhost/MySQLink/Simple/Function/Index/localhost/mysqlinktest'
                            }
                        );
                    }
                },
                {
                    text: 'Events',
                    iconCls: 'app-icon-event',
                    handler: function () {
                        alert('even');
                    }
                }

            ],
            listeners: {
                //add: function (store, operation, eOpts) {
                //alert('asdas');
                //}
            }/*,
             tbar: [
             {
             text: 'Refresh',
             scope: this,
             iconCls: 'x-tbar-loading',
             handler: this.onRefreshNode
             }
             ]*/
        });
        this.callParent();
    },
    addTab: function (obj) {
        var tp = Ext.getCmp('main-tab-panel');
        if (tp) {
            tp.add([obj]).show();
        }
    }
});
