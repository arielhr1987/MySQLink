/**
 *
 */
Ext.define('SearchFieldGrid', {
    extend: 'Ext.form.field.Trigger',
    requires: [],
    xtype: 'search-field-grid',
	width: 250,
	column: null,
	grid : null,
	searchRegExp: null,
	indexes : [],
	currentIndex : null,
	matchCls: 'x-livesearch-match',
	// detects html tag
    tagsRe: /<[^>]*>/gm,
    
    // DEL ASCII code
    tagsProtect: '\x0f',
	trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',//stop serach
	trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',//serach next
	trigger3Cls: Ext.baseCSSPrefix + 'form-search-trigger',//search back
	enableKeyEvents: true,
	
    initComponent: function () {
        var me = this;
		Ext.apply(this,{
			onTrigger1Click: me.onClearSearch, 
			onTrigger2Click: me.onFindPrev,
			onTrigger3Click: me.onFindNext,
			listeners: {
				specialkey: {
					fn: function (me, e) {
						if (e.getKey() == e.ESC) {
							me.setValue('');
						}
						if (e.getKey() == e.ENTER) {
							e.shiftKey ? me.onFindPrev():me.onFindNext();
						}						
					},
					scope: this
				},
				change: {
					fn: me.onTextFieldChange,
					scope: this,
					buffer: 100
				}/**/
			}
		});	
        this.callParent();
    },
	afterRender: function() {
        var me = this;
        me.callParent(arguments);	
		me.column = Ext.isNumber(me.column) ? me.grid.columns[me.column] : null;
		me.grid.getStore().on({
			load:{
				fn: me.onTextFieldChange,
				scope:me
			}
		});
    },
	onFindNext: function (){
		var me = this,
            idx;
             
        if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
            me.currentIndex = me.indexes[idx + 1] || me.indexes[0];
            me.grid.getSelectionModel().select(me.currentIndex);
        }
		me.focus();
	},
	onFindPrev: function (){
		var me = this,
            idx;
            
        if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
            me.currentIndex = me.indexes[idx - 1] || me.indexes[me.indexes.length - 1];
            me.grid.getSelectionModel().select(me.currentIndex);
        }
		me.focus();
	},
	onClearSearch: function (){
		this.setValue( '' );
	},
	onTextFieldChange: function (){
		var me = this,
             count = 0;

		me.grid.view.refresh();
		me.searchRegExp = new RegExp(me.getValue(), 'i');
		me.indexes = [];
		me.currentIndex = null;
		
		if (me.getValue() != '') {
		
			me.grid.getStore().each(function(record, idx) {
                var td = (	me.column === null)?
					Ext.fly(me.grid.view.getNode(idx)).down('td'):
					me.grid.view.getCell(record,me.column);
                var cell, matches, cellHTML;
                while(td) {
                    cell = td.down('.x-grid-cell-inner');
                    matches = cell.dom.innerHTML.match(me.tagsRe);
                    cellHTML = cell.dom.innerHTML.replace(me.tagsRe, me.tagsProtect);
                     
                     // populate indexes array, set currentIndex, and replace wrap matched string in a span
                    cellHTML = cellHTML.replace(me.searchRegExp, function(m) {
                        count += 1;
                        if (Ext.Array.indexOf(me.indexes, idx) === -1) {
                            me.indexes.push(idx);
                        }
                        if (me.currentIndex === null) {
                            me.currentIndex = idx;
                        }
                        return '<span class="' + me.matchCls + '">' + m + '</span>';
                    });
                    // restore protected tags
                    Ext.each(matches, function(match) {
                        cellHTML = cellHTML.replace(me.tagsProtect, match); 
                    });
                    // update cell html
                    cell.dom.innerHTML = cellHTML;
                    td = me.column === null ?td.next():false;
                }
            }, me);
			// results found
            if (me.currentIndex !== null) {
                me.grid.getSelectionModel().select(me.currentIndex);
            }
		}
		// no results found
        if (me.currentIndex === null) {
            me.grid.getSelectionModel().deselectAll();
        }

        // force textfield focus
        me.focus();
	}
	
});