/**
 *
 */
Ext.define('MySQLink.ux.MainViewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'Ext.layout.container.Border'
    ],
    layout: {
        type: 'border',
        padding: 5
    },
    defaults: {
        split: true,
        collapsible: true
    },
    items: [
        {
            region: 'north',
            xtype: 'main-toolbar',
            id: 'main-tool-bar',
            title: 'North',
            split: false,
            margin: '0 0 5 0',
            collapsible: false
        },
        {
            region: 'west',
            id: 'main-tree-view',
            title: 'Servers',
            iconCls: 'app-icon-server-tree',
            width: '20%',
            minWidth: 100,
            minHeight: 140,
            xtype: 'main-treeview'
        },
        {
            xtype: 'iframe-tab-panel',
            id: 'main-tab-panel',
            region: 'center',
            collapsible: false,
            items: [
                {
                    title: 'Welcome',
                    closable: false,
                    iconCls: 'app-icon-ok',
                    src: 'http://localhost/MySQLink/Simple/Query/Index/localhost'
                },
                {
                    title: 'Welcome',
                    closable: false,
                    iconCls: 'app-icon-error',
                    src: 'http://localhost/MySQLink/Simple/Procedure/Index/localhost/mysqlinktest'
                }
            ]
        }
    ]
});