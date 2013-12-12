<html>
<head>
    <title>Procedures</title>
    <style>
        #loading-mask {
            background-color: white;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            z-index: 20000;
        }

        #loading {
            height: auto;
            position: absolute;
            left: 45%;
            top: 40%;
            padding: 2px;
            z-index: 20001;
        }

        #loading a {
            color: #225588;
        }

        #loading .loading-indicator {
            background: white;
            color: #444;
            font: bold 13px Helvetica, Arial, sans-serif;
            height: auto;
            margin: 0;
            padding: 10px;
        }

        #loading-msg {
            font-size: 10px;
            font-weight: normal;
            white-space: nowrap;
        }
    </style>
</head>
<body>
<div id="loading-mask" style=""></div>
<div id="loading">
    <div class="loading-indicator" style="min-width:250px ">
        <img src="<?php echo Core::base_url() . RESOURCES . '/images/extanim32.gif' ?>" width="32" height="32"
             style="margin-right:8px;float:left;vertical-align:top;"/>Loading
        <br/><span id="loading-msg">Styles and images...</span>
    </div>
</div>
<?php
    //CSS
    link_tag('mysqlink/MySQLink');
    //link('ext/ext-theme-neptune/ext-theme-neptune-all');
    link_tag('ext/ext-theme-classic/ext-theme-classic-all');
    link_tag('../js/codemirror/lib/codemirror');
    link_tag('mysqlink/ux/CodeMirror');
?>
<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'ExtJS API...';</script>
<?php
    //ExtJS lib
    script('ext/ext-all');
?>
<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'CodeMirror...';</script>
<?php
    //Codemirror lib
    script('codemirror/lib/codemirror');
    script('codemirror/mode/mysql/mysql');
    script('codemirror/lib/util/formatting');
    script('codemirror/lib/util/match-highlighter');
    script('codemirror/lib/util/searchcursor');
    script('codemirror/lib/util/search-ext');
?>
<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'UI Components...';</script>
<?php
    //MySQLink lib
    script('mysqlink/ux/ProcedureGrid');
    script('mysqlink/ux/ParameterGrid');
    script('mysqlink/ux/ProcedureEditor');
    script('mysqlink/ux/MySQLink.ux.CodeMirror');
    script('mysqlink/ux/AutocompleteKeywords');
    script('mysqlink/ux/CodeMirrorAutocomplete');
	script('mysqlink/ux/SearchFieldGrid');
	
?>
<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Complete';</script>
<script>

    Ext.onReady(function () {
        Ext.require(['*']);
        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [
                {
                    xtype: 'procedure-grid',
                    region: 'center',
                    db: '<?php echo $db; ?>',
                    host: '<?php echo $host; ?>',
                    baseURL: '<?php echo Core::base_url(); ?>'
                }
            ]
        });
        var hideMask = function () {
            Ext.get('loading').remove();
            Ext.fly('loading-mask').animate({
                opacity: 0,
                remove: true
            });
        };
        Ext.defer(hideMask, 250);
    })
</script>
</body>
</html>