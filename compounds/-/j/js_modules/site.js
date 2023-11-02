mw.loader.using(['mediawiki.util']).done(function(){if(mw.config.get('wgPageName')==='Main_Page'||mw.config.get('wgPageName')==='Talk:Main_Page'){$(function(){mw.util.addPortletLink('p-lang','//meta.wikimedia.org/wiki/List_of_Wikipedias','Complete list','interwiki-completelist','Complete list of Wikipedias');});}mw.log.deprecate(window,'addPortletLink',mw.util.addPortletLink,'Use mw.util.addPortletLink instead');mw.log.deprecate(window,'getURLParamValue',mw.util.getParamValue,'Use mw.util.getParamValue instead');mw.log.deprecate(window,'hasClass',function(element,className){return $(element).hasClass(className);},'Use jQuery.hasClass() instead');var extraCSS=mw.util.getParamValue('withCSS'),extraJS=mw.util.getParamValue('withJS');if(extraCSS){if(extraCSS.match(/^MediaWiki:[^&<>=%#]*\.css$/)){mw.loader.load('/w/index.php?title='+extraCSS+'&action=raw&ctype=text/css','text/css');}else{mw.notify('Only pages from the MediaWiki namespace are allowed.',{title:'Invalid withCSS value'});}}if(
extraJS){if(extraJS.match(/^MediaWiki:[^&<>=%#]*\.js$/)){mw.loader.load('/w/index.php?title='+extraJS+'&action=raw&ctype=text/javascript');}else{mw.notify('Only pages from the MediaWiki namespace are allowed.',{title:'Invalid withJS value'});}}$(function(){var requireWikiminiatlas=$('a.external.text[href*="geohack"]').length||$('div.kmldata').length;if(requireWikiminiatlas){mw.loader.load('//meta.wikimedia.org/w/index.php?title=MediaWiki:Wikiminiatlas.js&action=raw&ctype=text/javascript');}});function makeCollapsibleMwCollapsible($content){var $tables=$content.find('table.collapsible:not(.mw-collapsible)').addClass('mw-collapsible');$.each($tables,function(index,table){if($(table).hasClass('collapsed')){$(table).addClass('mw-collapsed');}});if($tables.length>0){mw.loader.using('jquery.makeCollapsible').then(function(){$tables.makeCollapsible();});}}mw.hook('wikipage.content').add(makeCollapsibleMwCollapsible);function mwCollapsibleSetup($collapsibleContent){var $element,$toggle,
autoCollapseThreshold=2;$.each($collapsibleContent,function(index,element){$element=$(element);if($element.hasClass('collapsible')){$element.find('tr:first > th:first').prepend($element.find('tr:first > * > .mw-collapsible-toggle'));}if($collapsibleContent.length>=autoCollapseThreshold&&$element.hasClass('autocollapse')){$element.data('mw-collapsible').collapse();}else if($element.hasClass('innercollapse')){if($element.parents('.outercollapse').length>0){$element.data('mw-collapsible').collapse();}}$toggle=$element.find('.mw-collapsible-toggle');if($toggle.length){if($toggle.parent()[0].style.color){$toggle.find('a').css('color','inherit');}}});}mw.hook('wikipage.collapsibleContent').add(mwCollapsibleSetup);var collapseCaption='hide';var expandCaption='show';var navigationBarHide='['+collapseCaption+']';var navigationBarShow='['+expandCaption+']';function toggleNavigationBar(indexNavigationBar,event){var navToggle=document.getElementById('NavToggle'+indexNavigationBar);var navFrame=
document.getElementById('NavFrame'+indexNavigationBar);var navChild;if(!navFrame||!navToggle){return false;}if(navToggle.firstChild.data===navigationBarHide){for(navChild=navFrame.firstChild;navChild!==null;navChild=navChild.nextSibling){if($(navChild).hasClass('NavContent')){navChild.style.display='none';}}navToggle.firstChild.data=navigationBarShow;}else if(navToggle.firstChild.data===navigationBarShow){for(navChild=navFrame.firstChild;navChild!==null;navChild=navChild.nextSibling){if($(navChild).hasClass('NavContent')){navChild.style.display='block';}}navToggle.firstChild.data=navigationBarHide;}event.preventDefault();}function createNavigationBarToggleButton($content){var j,navChild,navToggle,navToggleText,isCollapsed,indexNavigationBar=0;var $divs=$content.find('div.NavFrame:not(.mw-collapsible)');$divs.each(function(i,navFrame){indexNavigationBar++;navToggle=document.createElement('a');navToggle.className='NavToggle';navToggle.setAttribute('id','NavToggle'+indexNavigationBar);
navToggle.setAttribute('href','#');$(navToggle).on('click',$.proxy(toggleNavigationBar,null,indexNavigationBar));isCollapsed=$(navFrame).hasClass('collapsed');for(navChild=navFrame.firstChild;navChild!==null&&!isCollapsed;navChild=navChild.nextSibling){if($(navChild).hasClass('NavPic')||$(navChild).hasClass('NavContent')){if(navChild.style.display==='none'){isCollapsed=!0;}}}if(isCollapsed){for(navChild=navFrame.firstChild;navChild!==null;navChild=navChild.nextSibling){if($(navChild).hasClass('NavPic')||$(navChild).hasClass('NavContent')){navChild.style.display='none';}}}navToggleText=document.createTextNode(isCollapsed?navigationBarShow:navigationBarHide);navToggle.appendChild(navToggleText);for(j=0;j<navFrame.childNodes.length;j++){if($(navFrame.childNodes[j]).hasClass('NavHead')){navToggle.style.color=navFrame.childNodes[j].style.color;navFrame.childNodes[j].appendChild(navToggle);}}navFrame.setAttribute('id','NavFrame'+indexNavigationBar);});}mw.hook('wikipage.content').add(
createNavigationBarToggleButton);function addEditIntro(name){$('.mw-editsection, #ca-edit, #ca-ve-edit').find('a').each(function(i,el){el.href=$(this).attr('href')+'&editintro='+name;});}if(mw.config.get('wgNamespaceNumber')===0){$(function(){if(document.getElementById('disambigbox')){addEditIntro('Template:Disambig_editintro');}});$(function(){var cats=mw.config.get('wgCategories');if(!cats){return;}if($.inArray('Living people',cats)!==-1||$.inArray('Possibly living people',cats)!==-1){addEditIntro('Template:BLP_editintro');}});}if(mw.config.get('wgAction')==='edit'||mw.config.get('wgAction')==='submit'){$(function(){if(document.location.search.indexOf('undo=')!==-1&&document.getElementsByName('wpAutoSummary')[0]){document.getElementsByName('wpAutoSummary')[0].value='1';}});}});
mw.loader.state({"site":"ready"});