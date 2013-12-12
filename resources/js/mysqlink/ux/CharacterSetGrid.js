/**
 *
 */
Ext.define('CharsetGrid', {
    extend: 'Ext.grid.Panel',
    requires: [],
    xtype: 'charset-grid',
    initComponent: function (opt) {

        var store = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            fields: ['Collation', 'Charset'],
            groupField: 'Charset',
            proxy: {
                type: 'ajax',
                pageParam: false, //to remove param "page"
                startParam: false, //to remove param "start"
                limitParam: false, //to remove param "limit"
                noCache: false, //to remove param "_dc"
                actionMethods: {
                    read: 'POST',
                    destroy: 'POST'
                },
                reader: {
                    root: 'rows'
                },
                api: {
                    read: this.url
                }
            },
            listeners: {
                'metachange': {
                    fn: function (store, meta, eOpt) {
                        meta.columns = Ext.Array.insert(meta.columns, 0, [Ext.create('Ext.grid.RowNumberer', {width: 30, maxWidth: 30})]);
                        Ext.Array.each(meta.columns,function(val,index,self){
                            if(val.my_type == 'checkcolumn'){
                                meta.columns[index].align = 'center';
                                meta.columns[index].renderer = function(value){
                                    var cssPrefix = Ext.baseCSSPrefix,
                                        cls = [cssPrefix + 'grid-checkcolumn'];
                                    if (value) {
                                        cls.push(cssPrefix + 'grid-checkcolumn-checked');
                                    }
                                    return '<img class="' + cls.join(' ') + '" src="' + Ext.BLANK_IMAGE_URL + '"/>';
                                }
                            }
                        });
                        this.reconfigure(store, meta.columns);
                    },
                    scope: this
                }
            }
        });
        Ext.apply(this, {
            store: store,
            loadMask: true,
            forceFit: true,
            //plugins: 'bufferedrenderer',
            tbar: this.createToolbar(),
            features: [
                {
                    ftype: 'grouping',
                    enableGroupingMenu: false,
                    groupHeaderTpl: 'Charset: {name}'
                }
            ],
            columns: [
                { text: 'Collation', dataIndex: 'Collation' },
                { text: 'Charset', dataIndex: 'Charset' }
            ],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            }
        });
        this.callParent();
    },
    createToolbar: function () {
        return[
            {
                text: 'Refresh',
                scope: this,
                iconCls: 'x-tbar-loading',
                handler: function () {
                    this.getStore().reload();
                }
            }/*,
            '->',
            {
                xtype: 'search-field-grid',
                emptyText: 'Search...',
                grid: this
            }*/
        ]
    }
});