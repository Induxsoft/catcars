var compatibilidad =
{
    trigger(element,event) {
        if (element) {
            let e = new Event(event);
            element.dispatchEvent(e);
        }
    },

    list: {
        formFilter: null,
        elements: null,

        table: null,
        tEvents: {},
        tData: {},

        _GET:{},
        url_buscar_car_modelo:"", url_buscar_car_version:"",

        init()
        {
            this.formFilter = document.getElementById("form_filter");
            this.table = document.getElementById("tbl_car_compatible");

            this.setKeyboardShortcuts();
            this.setTableEvents();
            this.setEvents();
        },

        setKeyboardShortcuts()
        {
            document.addEventListener("keydown", (e) => {
                // console.log("key: "+ e.key + " | " + "code: " + e.code);
                if (e.key === "Escape") {
                    e.preventDefault();
                    window.open("/","_top");
                }
                if (e.key === "F5") {
                    e.preventDefault();
                    window.location.reload();
                }
            });
        },

        setTableEvents()
        {
            if (!this.table) { console.warn("No fue posible obtener la referencia del editable."); return; }

            this.table.hiddeSelector = true;
            this.table.AutoAddRow = false;
            this.table.AutoDelRow = false;

            this.tEvents = this.table.EdiTable.Const.Events;
            // this.tData = this.table.DataArray;
        },

        setEvents()
        {
            if (!this.formFilter) { console.warn("No fue posible obtener la referencia del formulario de filtros."); return; }
            
            this.elements = this.formFilter.elements;
            
            this.elements["fil_car_marca"].addEventListener("change", (event) => {
                let url = this.url_buscar_car_modelo.replace("search","imarca");
                url = InduxsoftCrudlModel.UrlReplace(url,{imarca:Number(event.target.value)});

                let selected = Number(this._GET["car_modelo"]);
                
                this.fillSelects(this.elements["fil_car_modelo"],url,selected);
            });
            this.elements["fil_car_modelo"].addEventListener("change", (event) => {
                let url = this.url_buscar_car_version.replace("search","imodelo");
                url = InduxsoftCrudlModel.UrlReplace(url,{imodelo:Number(event.target.value)});

                let selected = Number(this._GET["car_version"]);

                this.fillSelects(this.elements["fil_car_version"],url,selected);
            });

            if (Number(this.elements["fil_car_marca"].value) > 0) compatibilidad.trigger(this.elements["fil_car_marca"],"change");

            this.elements["btn_aplicar_filtros"].addEventListener("click", (event) => {
                let type = event.target.type;
                if (type == "button")
                {
                    this.elements["fil_linea"].disabled = false;
                    this.elements["fil_marca"].disabled = false;
                    this.elements["fil_departamento"].disabled = false;
                    this.elements["fil_car_marca"].disabled = false;
                    this.elements["fil_car_modelo"].disabled = false;
                    this.elements["fil_car_version"].disabled = false;

                    this.elements["btn_reset_filters"].classList.remove("d-none");
                    this.elements["btn_aplicar_filtros"].classList.remove("btn-link","border-primary");
                    this.elements["btn_aplicar_filtros"].classList.add("btn-primary");
                    this.elements["btn_aplicar_filtros"].textContent = "Aplicar";
                    this.elements["btn_aplicar_filtros"].type = "submit";
                    event.preventDefault();
                }
            });

            this.elements["btn_reset_filters"].addEventListener("click", (event) => {
                this.elements["fil_linea"].disabled = true;
                this.elements["fil_marca"].disabled = true;
                this.elements["fil_departamento"].disabled = true;
                this.elements["fil_car_marca"].disabled = true;
                this.elements["fil_car_modelo"].disabled = true;
                this.elements["fil_car_version"].disabled = true;

                this.elements["btn_reset_filters"].classList.add("d-none");
                this.elements["btn_aplicar_filtros"].classList.add("btn-link","border-primary");
                this.elements["btn_aplicar_filtros"].classList.remove("btn-primary");
                this.elements["btn_aplicar_filtros"].textContent = "Modificar";
                this.elements["btn_aplicar_filtros"].type = "button";
            });
        },

        fillSelects(out,url,selected=0){
            let onSuccess = (data) => {
                if (data.message) {
                    console.error(data.message);
                    return;
                }
                
                out.innerHTML = "";
                data.unshift({sys_pk:0, descripcion:"(Todos)"});
                data.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.sys_pk;
                    option.text = item.descripcion;
                    if (item.sys_pk == selected) option.selected = true;

                    out.appendChild(option);
                });
                
                compatibilidad.trigger(out,"change");
            }
            let onFailure = (error) => { console.error(error) }
            InduxsoftCrudlModel.InvokeService(url,null,onSuccess,onFailure,"GET",false,false);
        },
    }
}