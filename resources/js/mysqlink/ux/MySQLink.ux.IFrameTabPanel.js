/**
 *
 */

Ext.define('MySQLink.ux.IFrameTabPanel', {
    extend: 'Ext.tab.Panel',
    requires: [
        'Ext.tab.*'
    ],
    xtype: 'iframe-tab-panel',
    plugins: [Ext.create('Ext.ux.TabReorderer')/*,{
        ptype: 'tabscrollermenu',
        maxText  : 15,
        pageSize : 5
    }*/],
    initComponent: function () {

        Ext.apply(this, {
            /*tabBar: {
                items: [{
                    xtype: 'tbfill'
                }, {
                    xtype: 'button',
                    text: 'Test Button'
                }]
            },*/
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
    add: function (config) {
        for (var i = 0; i < config.length; i++) {
            Ext.apply(config[i], {
                hideMode: 'offsets',//to prevent error loading hidden iframes
                xtype: 'uxiframe'
            });
        }
        return this.callParent(config);
    }
})
;
