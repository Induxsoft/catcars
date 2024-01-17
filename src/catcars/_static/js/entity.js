window.addEventListener("DOMContentLoaded",()=>
{
    entity.init();
});

var entity=
{
    init()
    {
        entity.marca=document.getElementById("marca");
        entity.modelo=document.getElementById("ref_car_modelo");
        if(entity.marca)entity.marca.addEventListener("change",()=>
        {
            if(entity.marca.value.trim()=="")return;

            InduxsoftCrudlModel.InvokeService(entity.url_modelo+"?marca="+entity.marca.value,null,
                (data)=>
                {
                    this.PrintOptions(data,entity.modelo);
                },
                (error)=>
                {
                    alert(error.message?? error);
                },"GET",false);
        });
        this.trigger(entity.marca,"change");
    },
    trigger:function(element,event)
	{
		var e=new Event(event);
       if(element)element.dispatchEvent(e);
	},
    PrintOptions(data,element)
    {
        if(!data || !element)return;
        var html="";
        for (let i = 0; i < data.length; i++) {
            var itm = data[i];
            html+=`<option value="${itm.sys_pk}">${itm.codigo+" "+itm.descripcion}</option>`;
        }
        if(element)element.innerHTML=html;
    }
}