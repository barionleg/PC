(function(){mw.hook('wikipage.content').add(function($content){$content.find('.PopUpMediaTransform a').each(function(){var link,title,$parent=$(this).parent();if($parent.attr('videopayload')){$(this).on('click',function(){var thisref=this;if(!mw.OgvJsSupport.canPlayNatively()){mw.OgvJsSupport.initAudioContext();}mw.loader.using('mw.MwEmbedSupport',function(){var $videoContainer=$($(thisref).parent().attr('videopayload'));mw.addDialog({width:'auto',height:'auto',title:mw.html.escape($videoContainer.find('video, audio').attr('data-mwtitle')),content:$videoContainer,close:function(){$(this).remove();return true;},open:function(){$(this).find('video, audio').embedPlayer();}}).css('overflow','hidden');});return false;});}else if($parent.attr('data-videopayload')){link=$(this).attr('href');title=mw.Title.newFromImg({src:link});if(title&&title.getPrefixedDb()!==mw.config.get('wgPageName')){$(this).attr('href',title.getUrl());}}});});}());
mw.loader.state({"mw.PopUpMediaTransform":"ready"});