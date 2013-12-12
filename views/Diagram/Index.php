<html>
<head>
    <title>Database Diagram</title>
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
?>
<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'ExtJS API...';</script>
<?php
    //ExtJS lib
    script('ext/ext-all');
?>
<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Components...';</script>
<?php
    //ExtJS lib
    script('mysqlink/ux/DatabaseDiagram');
?>
<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Complete';</script>
<script>

    Ext.onReady(function () {
        Ext.require(['*']);
        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [
                {
                    xtype: 'database-diagram',
                    region: 'center'/*,
                    dbList:<?php echo $dbs; ?>,
                    host: '<?php echo $host; ?>'*/
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