export const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
.aa-root{--bg:#1B1F23;--surface:#242A33;--surface-2:#2D343F;--border:#3A4250;--text:#F2EEE4;--text-dim:#9AA3AF;--brass:#C9A227;--brass-dim:rgba(201,162,39,0.16);--water:#3FA9D6;--water-dim:rgba(63,169,214,0.16);--money:#5FBE7E;--money-dim:rgba(95,190,126,0.16);--task:#AAB3BF;--task-dim:rgba(170,179,191,0.14);--danger:#E2625A;--danger-dim:rgba(226,98,90,0.16);--radius:9px;position:relative;max-width:460px;margin:0 auto;height:100vh;min-height:560px;background:var(--bg);color:var(--text);font-family:'IBM Plex Sans',system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden;}
.aa-root--loading{align-items:center;justify-content:center;}
.aa-spin{color:var(--brass);animation:aa-spin 1.4s linear infinite;}
@keyframes aa-spin{to{transform:rotate(360deg);}}
*{box-sizing:border-box;}
.aa-header{padding:18px 18px 12px;border-bottom:1px solid var(--border);flex-shrink:0;}
.aa-eyebrow{font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;color:var(--brass);margin-bottom:8px;}
.aa-datenav{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.aa-datenav__label{font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:600;text-align:center;flex:1;}
.aa-datenav__label--solo{text-align:left;font-size:19px;}
.aa-todaybtn{margin-top:8px;background:var(--brass-dim);color:var(--brass);border:1px solid var(--brass);border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;cursor:pointer;}
.aa-main{flex:1;overflow-y:auto;padding:14px 14px 90px;}
.aa-empty{color:var(--text-dim);font-size:13.5px;text-align:center;padding:40px 20px;line-height:1.5;}
.aa-empty--tight{padding:10px 4px;text-align:left;}
.aa-stamp{font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:12.5px;border:1.5px dashed var(--water);color:var(--water);border-radius:6px;padding:5px 6px;min-width:50px;text-align:center;transform:rotate(-1.5deg);flex-shrink:0;background:var(--water-dim);}
.aa-stamp--money{border-color:var(--money);color:var(--money);background:var(--money-dim);}
.aa-stamp--brass{border-color:var(--brass);color:var(--brass);background:var(--brass-dim);}
.aa-daylist{display:flex;flex-direction:column;gap:10px;}
.aa-task-row-group{display:flex;flex-direction:column;gap:6px;margin-bottom:4px;}
.aa-taskrow{display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--task);border-radius:var(--radius);padding:9px 10px;}
.aa-taskrow.is-done{opacity:0.5;}.aa-taskrow.is-done .aa-taskrow__text{text-decoration:line-through;}
.aa-taskrow__text{flex:1;font-size:13.5px;}
.aa-checkbox{width:20px;height:20px;border-radius:5px;border:1.5px solid var(--task);background:transparent;color:var(--bg);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;}
.aa-taskrow.is-done .aa-checkbox{background:var(--task);color:var(--bg);}
.aa-ticket{display:flex;gap:10px;align-items:flex-start;background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--water);border-radius:var(--radius);padding:10px;}
.aa-ticket--money{border-left-color:var(--money);}.aa-ticket.is-done{opacity:0.55;}
.aa-ticket__body{flex:1;min-width:0;}.aa-ticket__top{display:flex;align-items:center;gap:6px;margin-bottom:4px;}
.aa-ticket__icon{color:var(--text-dim);display:flex;}
.aa-ticket__client{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14.5px;}
.aa-ticket__meta{display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
.aa-ticket__sub{font-size:12px;color:var(--text-dim);display:flex;align-items:center;gap:3px;}
.aa-ticket__notas{font-size:12px;color:var(--text-dim);width:100%;}
.aa-ticket__actions{display:flex;flex-direction:column;gap:6px;}
.aa-tag{font-size:11px;font-weight:600;background:var(--water-dim);color:var(--water);border-radius:5px;padding:2px 7px;}
.aa-tag--money{background:var(--money-dim);color:var(--money);}
.aa-tag--gremio{background:var(--surface-2);color:var(--text-dim);margin-right:4px;}
.aa-tag--estado-encurso{background:var(--water-dim);color:var(--water);}
.aa-tag--estado-pausada{background:var(--brass-dim);color:var(--brass);}
.aa-tag--estado-terminada{background:var(--money-dim);color:var(--money);}
.aa-tag--estado-borrador{background:var(--task-dim);color:var(--task);}
.aa-tag--estado-enviado{background:var(--water-dim);color:var(--water);}
.aa-tag--estado-aceptado{background:var(--money-dim);color:var(--money);}
.aa-tag--estado-rechazado{background:var(--danger-dim);color:var(--danger);}
.aa-iconbtn{width:28px;height:28px;border-radius:7px;border:1px solid var(--border);background:var(--surface-2);color:var(--text-dim);display:flex;align-items:center;justify-content:center;cursor:pointer;text-decoration:none;}
.aa-iconbtn--ok{color:var(--money);}
.aa-iconbtn--danger{background:var(--danger-dim);color:var(--danger);border-color:var(--danger);}
.aa-weekstrip{display:flex;gap:5px;margin-bottom:14px;}
.aa-daypill{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;background:var(--surface);border:1px solid var(--border);border-radius:9px;padding:8px 2px;cursor:pointer;color:var(--text-dim);}
.aa-daypill.is-today{border-color:var(--brass);}
.aa-daypill.is-selected{background:var(--brass-dim);border-color:var(--brass);color:var(--text);}
.aa-daypill__wd{font-size:10px;font-weight:600;letter-spacing:0.04em;}
.aa-daypill__num{font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;}
.aa-daypill__dots{display:flex;gap:2px;height:5px;}
.aa-dot{width:5px;height:5px;border-radius:50%;display:inline-block;}
.aa-dot--water{background:var(--water);}.aa-dot--money{background:var(--money);}.aa-dot--task{background:var(--task);}.aa-dot--brass{background:var(--brass);}
.aa-weekday-title{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:15px;margin-bottom:10px;color:var(--text-dim);}
.aa-view{display:flex;flex-direction:column;}
.aa-subtabs{display:flex;gap:6px;margin-bottom:12px;}
.aa-subtab{flex:1;background:var(--surface);border:1px solid var(--border);color:var(--text-dim);border-radius:8px;padding:8px 0;font-size:12.5px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;}
.aa-subtab.is-active{background:var(--brass-dim);border-color:var(--brass);color:var(--brass);}
.aa-subtab__badge{background:var(--brass);color:var(--bg);border-radius:9px;font-size:10px;padding:1px 6px;}
.aa-leadactions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
.aa-resumen{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;}
.aa-resumen__chip{display:flex;align-items:center;gap:5px;background:var(--brass-dim);border:1px solid var(--brass);color:var(--brass);border-radius:7px;padding:6px 9px;font-size:11.5px;font-weight:600;cursor:pointer;}
.aa-viewheader{display:flex;align-items:center;justify-content:space-between;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:17px;margin-bottom:12px;}
.aa-addsmall{display:flex;align-items:center;gap:4px;background:var(--brass-dim);color:var(--brass);border:1px solid var(--brass);border-radius:7px;padding:5px 9px;font-size:12.5px;font-weight:600;cursor:pointer;}
.aa-addsmall--brass{background:var(--brass);color:var(--bg);border-color:var(--brass);flex-shrink:0;}
.aa-clientlist{display:flex;flex-direction:column;gap:8px;}
.aa-clientcard{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:11px;}
.aa-clientcard__top{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.aa-clientcard__name{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14.5px;}
.aa-clientcard__row{display:flex;gap:10px;align-items:center;margin-top:5px;font-size:12px;color:var(--text-dim);}
.aa-clientcard__row span{display:flex;align-items:center;gap:3px;}
.aa-clientcard__sub{font-size:12px;color:var(--text-dim);margin-top:5px;}
.aa-obrablock{margin-top:4px;}
.aa-obrablock__title{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:12.5px;color:var(--text-dim);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.04em;}
.aa-inlineform{display:flex;flex-direction:column;gap:6px;margin-top:8px;}
.aa-flag{display:flex;align-items:center;gap:3px;font-size:11px;color:var(--danger);font-weight:600;}
.aa-empexpand{margin-top:10px;padding-top:10px;border-top:1px dashed var(--border);display:flex;flex-direction:column;gap:8px;}
.aa-jornadas{background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:9px;}
.aa-jornadas__nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.aa-jornadas__label{font-size:11.5px;color:var(--text-dim);font-weight:600;}
.aa-jornadas__days{display:flex;gap:4px;}
.aa-jdaybtn{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;background:var(--surface);border:1px solid var(--border);border-radius:7px;padding:6px 2px;cursor:pointer;color:var(--text-dim);}
.aa-jdaybtn.is-today{border-color:var(--brass);}
.aa-jdaybtn.is-pending{background:var(--brass-dim);border-color:var(--brass);color:var(--brass);}
.aa-jdaybtn.is-paid{background:var(--money-dim);border-color:var(--money);color:var(--money);}
.aa-jdaybtn__wd{font-size:9.5px;font-weight:600;}
.aa-jdaybtn__num{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:700;}
.aa-jornadas__count{font-size:11px;color:var(--text-dim);margin-top:6px;text-align:center;}
.aa-jornadas__legend{display:flex;flex-wrap:wrap;gap:9px;margin-top:8px;font-size:10.5px;color:var(--text-dim);}
.aa-jornadas__legend span{display:flex;align-items:center;gap:4px;}
.aa-pendingbar{display:flex;align-items:center;justify-content:space-between;gap:8px;background:var(--brass-dim);border:1px solid var(--brass);color:var(--brass);border-radius:8px;padding:8px 10px;font-size:12px;font-weight:600;}
.aa-globalcard{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:12px;}
.aa-globalcard__row{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.aa-globalcard__label{font-size:12px;color:var(--text-dim);font-weight:600;}
.aa-globalcard__value{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13.5px;text-align:right;}
.aa-globalcard__value--brass{color:var(--brass);}.aa-globalcard__value--money{color:var(--money);}
.aa-globalcard__divider{height:1px;background:var(--border);margin:10px 0;}
.aa-globalcard__rangerow{display:flex;align-items:center;gap:8px;}
.aa-globalcard__y{font-size:11.5px;color:var(--text-dim);}
.aa-input--sm{padding:6px 7px;font-size:12.5px;flex:1;}
.aa-paylist{display:flex;flex-direction:column;gap:4px;}
.aa-payrow{display:flex;gap:8px;font-size:12px;color:var(--text-dim);align-items:center;}
.aa-payrow__date{font-family:'IBM Plex Mono',monospace;}
.aa-payrow__concepto{flex:1;}
.aa-payrow__importe{color:var(--brass);font-weight:600;}
.aa-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.55);display:flex;align-items:flex-end;z-index:30;}
.aa-sheet{width:100%;max-height:86%;overflow-y:auto;background:var(--surface);border-top:1px solid var(--border);border-radius:16px 16px 0 0;padding:10px 18px 24px;display:flex;flex-direction:column;}
.aa-sheet__handle{width:36px;height:4px;border-radius:3px;background:var(--border);margin:4px auto 14px;}
.aa-sheet__title{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:16px;margin-bottom:12px;}
.aa-choicegrid{display:flex;gap:8px;}
.aa-choice{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 6px;border-radius:11px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);cursor:pointer;font-size:12.5px;font-weight:600;}
.aa-choice--water{color:var(--water);border-color:var(--water);background:var(--water-dim);}
.aa-choice--money{color:var(--money);border-color:var(--money);background:var(--money-dim);}
.aa-choice--task{color:var(--task);border-color:var(--task);background:var(--task-dim);}
.aa-label{font-size:11.5px;color:var(--text-dim);margin:10px 0 4px;display:block;font-weight:600;}
.aa-input{width:100%;background:var(--surface-2);border:1px solid var(--border);border-radius:7px;padding:9px 10px;color:var(--text);font-size:14px;font-family:'IBM Plex Sans',sans-serif;}
.aa-textarea{resize:vertical;min-height:56px;}
.aa-row2{display:flex;gap:10px;}
.aa-row2>div{flex:1;}
.aa-submit{margin-top:16px;padding:12px;border-radius:9px;border:none;font-weight:700;font-size:14.5px;cursor:pointer;color:var(--bg);background:var(--brass);width:100%;}
.aa-submit--water{background:var(--water);}.aa-submit--money{background:var(--money);}.aa-submit--task{background:var(--task);}.aa-submit--brass{background:var(--brass);}
.aa-submit--danger{background:transparent;color:var(--danger);border:1px solid var(--danger);margin-top:8px;}
.aa-sheet__close{margin-top:14px;background:none;border:none;color:var(--text-dim);display:flex;align-items:center;justify-content:center;gap:5px;font-size:13px;cursor:pointer;padding:6px;}
.aa-fab{position:absolute;right:16px;bottom:78px;z-index:20;width:54px;height:54px;border-radius:50%;background:var(--brass);color:var(--bg);border:none;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.4);cursor:pointer;}
.aa-tabbar{display:flex;border-top:1px solid var(--border);background:var(--surface);flex-shrink:0;overflow-x:auto;}
.aa-tab{flex:1 0 auto;min-width:60px;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 2px 9px;background:none;border:none;color:var(--text-dim);font-size:9.5px;font-weight:600;cursor:pointer;white-space:nowrap;}
.aa-tab.is-active{color:var(--brass);}
.aa-editor-view{display:flex;flex-direction:column;height:100%;background:var(--bg);}
.aa-editor-header{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--border);flex-shrink:0;background:var(--surface);}
.aa-editor-title{flex:1;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.aa-editor-body{flex:1;overflow-y:auto;padding:12px 14px 24px;display:flex;flex-direction:column;gap:10px;}
.aa-editor-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:13px;}
.aa-gremio-block{margin-bottom:10px;}
.aa-gremio-block__header{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;padding-bottom:6px;border-bottom:1px solid var(--border);}
.aa-gremio-total{font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:13px;color:var(--brass);}
.aa-linea-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 0;border-bottom:1px dashed var(--border);}
.aa-linea-row:last-child{border-bottom:none;}
.aa-linea-main{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0;}
.aa-linea-concepto{font-size:13.5px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.aa-linea-qty{font-size:11.5px;color:var(--text-dim);}
.aa-linea-right{display:flex;align-items:center;gap:6px;flex-shrink:0;}
.aa-linea-total{font-family:'IBM Plex Mono',monospace;font-size:12.5px;font-weight:600;color:var(--money);}
.aa-addlinea-form{display:flex;flex-direction:column;gap:6px;padding-top:12px;border-top:1px dashed var(--border);margin-top:8px;}
.aa-summary-card{background:var(--surface-2);}
.aa-summary-rows{display:flex;flex-direction:column;gap:6px;margin-bottom:4px;}
.aa-summary-row{display:flex;align-items:center;justify-content:space-between;font-size:13px;padding:2px 0;}
.aa-summary-gremio{color:var(--text-dim);}
.aa-summary-divider{height:1px;background:var(--border);margin:8px 0;}
.aa-summary-iva-row{cursor:pointer;color:var(--text-dim);display:flex;align-items:center;justify-content:space-between;font-size:13px;padding:4px 0;}
.aa-summary-iva-label{display:flex;align-items:center;}
.aa-summary-total-row{margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:700;color:var(--brass);}
@media(prefers-reduced-motion:reduce){.aa-spin{animation:none;}}
`
