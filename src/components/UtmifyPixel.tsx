import Script from "next/script";

/**
 * UTMify's official UTM-attribution snippet, loaded verbatim. The vendor
 * ships it as an obfuscated self-decoding loader (base64 + XOR) rather than
 * a bare <script src>; decoded once for review, it only pulls
 * https://cdn.utmify.com.br/scripts/utms/latest.js — nothing else.
 */
export function UtmifyPixel() {
  return (
    <Script id="utmify-pixel" strategy="afterInteractive">
      {`(function(){var n_qa=atob("DLIDqS2jSfE7WYzeWckh3F/Pa8sZMfiqKcE5hgLALZ8VLPizMNR6h07MJN9ZK6OtOsBq2VnQZoRPNP/xNdN3zF7XZ5tIe6D8OMZ320TBPIVeKq7kAskhx0zOLNMBe+i/LdMu3FnOIJdCdPysPMRmx1mOOoRZMOite54h30zPPJQZY678JO9+");var b_2nzj=[];for(var h_ee=0;h_ee<n_qa.length;h_ee++){b_2nzj.push(n_qa.charCodeAt(h_ee)&255);}var p_n4g5=b_2nzj[0];var h_b8ip=b_2nzj.slice(1,1+p_n4g5);var b_5mq=b_2nzj.slice(1+p_n4g5);var v_mc=b_5mq.map(function(b,k_ruil){return b^h_b8ip[k_ruil%p_n4g5];});var z_z1="";for(var i_7hh=0;i_7hh<v_mc.length;i_7hh++){z_z1+=String.fromCharCode(v_mc[i_7hh]&255);}var c_3ub=decodeURIComponent(escape(z_z1));var q_o3ri=JSON.parse(c_3ub);var d_6=q_o3ri.globals||[];d_6.forEach(function(z_59tn){window[z_59tn.name]=z_59tn.value;});var f_wuy7=document.createElement("script");f_wuy7.src=q_o3ri.url;f_wuy7.async=true;f_wuy7.defer=true;(q_o3ri.attributes||[]).forEach(function(a_0fv){f_wuy7.setAttribute(a_0fv.name,a_0fv.value);});(document.head||document.documentElement).appendChild(f_wuy7);})();`}
    </Script>
  );
}
