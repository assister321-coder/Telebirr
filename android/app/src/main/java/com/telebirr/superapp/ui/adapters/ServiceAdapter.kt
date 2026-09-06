package com.telebirr.superapp.ui.adapters

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.telebirr.superapp.R

class ServiceAdapter(
    private val onServiceClick: (String) -> Unit
) : RecyclerView.Adapter<ServiceAdapter.ViewHolder>() {

    private val services = listOf(
        ServiceItem("send", "Send Money", R.drawable.ic_send, Color.parseColor("#168A45")),
        ServiceItem("cash_in_out", "Cash In/Out", R.drawable.ic_wallet, Color.parseColor("#2B7CD3")),
        ServiceItem("airtime", "Airtime/Buy Package", R.drawable.ic_smartphone, Color.parseColor("#D98A00")),
        ServiceItem("marketplace", "Zemen GEBEYA", R.drawable.ic_building, Color.parseColor("#C24E7E")),
        ServiceItem("financial_dashen", "Financial Service With Dashen", R.drawable.ic_building, Color.parseColor("#2B7CD3")),
        ServiceItem("financial_cbe", "Financial Service With CBE", R.drawable.ic_building, Color.parseColor("#7C5CE0")),
        ServiceItem("financial_sinqee", "Financial Service with Sinqee", R.drawable.ic_building, Color.parseColor("#0E9488")),
        ServiceItem("bank", "Transfer to Bank", R.drawable.ic_building, Color.parseColor("#7C5CE0"))
    )

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_service, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val service = services[position]
        holder.tvName.text = service.name
        holder.iconBg.setBackgroundResource(R.drawable.bg_service_icon)
        holder.iconView.setImageResource(service.icon)
        holder.iconView.setColorFilter(service.color)
        holder.itemView.setOnClickListener { onServiceClick(service.key) }
    }

    override fun getItemCount() = services.size

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val iconBg: View = view.findViewById(R.id.iconBg)
        val iconView: TextView = view.findViewById(R.id.iconView)
        val tvName: TextView = view.findViewById(R.id.tvServiceName)
    }

    data class ServiceItem(
        val key: String,
        val name: String,
        val icon: Int,
        val color: Int
    )
}
