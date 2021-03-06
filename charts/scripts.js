function handleRoastDataAndDrawGraph(data)
{
	var dataObj = {datasets: []}
	for(var i = 0; i < data.data.length; i++)
	{
		dataObj.datasets.push({label:data.data[i].roastId,data:data.data[i].data})
	}
	drawGraph(dataObj);
	$('.main-roast-graph .loader').hide();
	$("#main-roast-chart-container").show();
}
var myChart;
function initChart()
{
	var ctx = document.getElementById("main-roast-chart");
	myChart = new Chart(ctx, {
	    type: 'line',
	    options: {
	    	maintainAspectRatio: true,
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true,
	                    min: 0,
	                    stepSize: 10
	                }
	            }],
	            xAxes: [{
	                type: 'time',
	                position:"bottom",
	                time: {
                    	displayFormats: {
                        	minute: 'mm:ss'
                    	}
                	}
	            }]
	        },
	        legend: {display:false},
	        elements:{
	        	line: {
	        		fill: false
	        	}
	        }
	    }
	});
}
function drawGraph(data)
{
	myChart.data.datasets = data.datasets;
	myChart.update();
}

$(function(){
	$('.maximize-button').closest('.panel').data('maximized',false);
	$('.btn.maximize-button').on('click',toggleMaximizePanel);
});

function toggleMaximizePanel(event,elmTarget)
{
	if(elmTarget)
	{
		$btn = $([]);
		$cont = elmTarget;
	}
	else
	{
		$btn = $(this);
		$cont = $btn.closest('.panel');
	}
	bolMax = $cont.data('maximized');
	if(bolMax)
	{
		$cont.parent().find('.overlay').remove();
		$cont.data('maximized',false).attr('data-maximize',false);
		$btn.find('span').removeClass('glyphicon-resize-small').addClass('glyphicon-resize-full');
	}
	else
	{
		$cont.parent().prepend('<div class="overlay"></div>');
		$cont.data('maximized',true).attr('data-maximize',true);
		$btn.find('span').removeClass('glyphicon-resize-full').addClass('glyphicon-resize-small');
	}
}

function saveBeanAndRoastIntent(roastId)
{
	var beanId = $('[data-for="beanId"]').val();
	var roastIntentId = $('[data-for="roastIntentId"]').val();

	function handleRoastSaved(data)
	{
		//elmTarget.html(data);
		//callback();
	}

	$.ajax({
	  url: '/charts/ajax/proxy.asp',
	  data: {function: "saveRoast",roastId: roastId, beanId: beanId, roastIntentId: roastIntentId},
	  success: handleRoastSaved
	});
}
function saveBeanAndBeanIntent(beanId, callback)
{
	var beanName = $('[data-for="beanName"]').val();
	var beanIntentId = $('[data-for="beanIntentId"]').val();
	var beanNote = $('[data-for="beanNote"]').val();

	$.ajax({
	  url: '/charts/ajax/proxy.asp',
	  data: {function: "saveBean",beanId: beanId, beanName: beanName, beanIntentId: beanIntentId,beanNote: beanNote},
	  success: callback
	});
}
function loadBeans(elmTarget, callback)
{
	function handleBeansTableLoaded(data)
	{
		elmTarget.html(data);
		callback ? callback() : void(0);
	}

	$.ajax({
	  url: '/charts/ajax/proxy.asp',
	  data: {function: "writeBeansTable"},
	  success: handleBeansTableLoaded,
	  dataType: 'html'
	});
}

function loadBean(elmTarget, beanId, callback)
{
	function handleBeanLoaded(data)
	{
		elmTarget.html(data);
		callback ? callback() : void(0);
	}

	$.ajax({
	  url: '/charts/ajax/proxy.asp',
	  data: {function: "writeBean",beanId: beanId},
	  success: handleBeanLoaded,
	  dataType: 'html'
	});
}

function deleteBean(beanId, callback)
{
	$.ajax({
	  url: '/charts/ajax/proxy.asp',
	  data: {function: "deleteBean",beanId: beanId},
	  success: callback
	});
}

function deleteRoast(roastId, callback)
{
	$.ajax({
	  url: '/charts/ajax/proxy.asp',
	  data: {function: "deleteRoast",roastId: roastId},
	  success: callback
	});
}


function handleAddRoastLoaded(elmTarget)
{
	var $container = elmTarget.closest('.panel');
	$container.show();
	toggleMaximizePanel(null,$container);
	$container.find('td.view-column a').off('click').on('click',handleAddRoastClick);
	$container.find('.btn-save').off('click').on('click',function(){endAddRoast(elmTarget)});
}
function handleAddRoastClick(event)
{
	var roastId = $(this).closest('[data-roast-id]').data('roast-id');
	addRoastIdToGraphed(roastId);
	$(this).closest('td').addClass('picked');
}
function addRoastIdToGraphed(roastId)
{
	__graphedRoasts.push(roastId);
}
function reloadRoastsTable(elmTarget, callback, __graphedRoasts)
{
	function handleRoastsTableLoaded(data)
	{
		elmTarget.html(data);
		callback ? callback() : void(0);
	}
	if(__graphedRoasts)
	{
		$.ajax({
		  url: '/charts/ajax/proxy.asp',
		  data: {function: "writeRoastsPicker", graphedRoasts: __graphedRoasts},
		  success: handleRoastsTableLoaded,
		  dataType: 'html'
		});
	}
	else
	{
		$.ajax({
		  url: '/charts/ajax/proxy.asp',
		  data: {function: "writeRoastsTable"},
		  success: handleRoastsTableLoaded,
		  dataType: 'html'
		});
	}
}

function loadRoast(elmTarget, roastId, callback)
{
	function handleRoastLoaded(data)
	{
		elmTarget.html(data);
		callback ? callback() : void(0);
		__rotate = 0;
	}

	$.ajax({
	  url: '/charts/ajax/proxy.asp',
	  data: {function: "writeRoast",roastId: roastId},
	  success: handleRoastLoaded,
	  dataType: 'html'
	});
}

function startAddRoast(elmTarget)
{
	reloadRoastsTable(elmTarget,function(){handleAddRoastLoaded(elmTarget)},__graphedRoasts);
}
function endAddRoast(elmTarget)
{
	var $container = elmTarget.closest('.panel');
	$container.hide();
	toggleMaximizePanel(null,$container);
	loadDataForRoast(__graphedRoasts,handleRoastDataAndDrawGraph);
}


function loadDataForRoast(arrRoastIds, callback)
{
	$.ajax({
	  url: '/charts/ajax/proxy.asp',
	  data: {function: "getRoastData",roastIds: arrRoastIds},
	  success: callback,
	  dataType: 'json',
	  method: 'POST'
	});
}

function startPreview()
{
	var $elm = $(this);
	if (this.files && this.files[0]) {
	    var reader = new FileReader();

	    reader.onload = function (e) {
	        $elm.closest('.form-group').find('img.live-thumb').attr('src', e.target.result);
	        $elm.closest('.form-group').find('.live-photo').show();
	    }

	    reader.readAsDataURL(this.files[0]);
	}
}

function incrementRotation()
{
	__rotate = __rotate == 0 ? 90 : (((__rotate/90)+1) * 90);
	__rotate = __rotate == 360 ? 0: __rotate;
	$(this).closest('.form-group').find('.rotate-degs').html('('+__rotate+'&deg;)');
}

function startUpload()
{
	var $elm = $('#file');
    var file_data = $elm.prop('files')[0];
    var form_data = new FormData();
    form_data.append('file', file_data);
    form_data.append('roast-id', __roastId);
    form_data.append('rotate', __rotate);
    $.ajax({
        url: '/charts/ajax/upload.asp', // point to server-side PHP script 
        dataType: 'text', // what to expect back from the PHP script
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
        success: function () {
            loadRoast($('.main-roast').find('.resultcontainer'),__roastId,bindEvents);
        },
        error: function (response) {
            alert(response);
        }
	});
}

function deletePicture()
{
	if(confirm("Er du sikker?"))
	{
		function handlePicDeleted(data)
		{
			loadRoast($('.main-roast').find('.resultcontainer'),__roastId,bindEvents);
		}

		$.ajax({
		  url: '/charts/ajax/proxy.asp',
		  data: {function: "deletePicture",roastId: __roastId},
		  success: handlePicDeleted
		});
	}
}


































