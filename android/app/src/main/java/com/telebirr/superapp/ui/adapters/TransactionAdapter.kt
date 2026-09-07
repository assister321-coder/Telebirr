package com.telebirr.superapp.ui.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.telebirr.superapp.R
import com.telebirr.superapp.data.Transaction
import com.telebirr.superapp.data.TxKind
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class TransactionAdapter(
    private val transactions: List<Transaction>
) : RecyclerView.Adapter<TransactionAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_transaction, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val tx = transactions[position]
        holder.tvTitle.text = tx.title

        val prefix = if (tx.amount > 0) "+" else ""
        holder.tvAmount.text = "${prefix}${String.format("%,.2f", kotlin.math.abs(tx.amount))}"
        holder.tvAmount.setTextColor(
            holder.itemView.context.getColor(
                if (tx.amount > 0) R.color.tx_received else R.color.tx_sent
            )
        )

        val dateFormat = SimpleDateFormat("MMM dd, HH:mm", Locale.getDefault())
        holder.tvDate.text = dateFormat.format(Date(tx.ts))

        // Set icon based on transaction kind
        val (iconRes, color) = when (tx.kind) {
            TxKind.SENT -> R.drawable.ic_send to R.color.tx_sent
            TxKind.RECEIVED -> R.drawable.ic_wallet to R.color.tx_received
            TxKind.BILL -> R.drawable.ic_lightbulb to R.color.tx_bill
            TxKind.AIRTIME -> R.drawable.ic_smartphone to R.color.tx_airtime
            TxKind.BANK -> R.drawable.ic_building to R.color.tx_bank
            TxKind.MERCHANT -> R.drawable.ic_qr_code to R.color.tx_merchant
        }
        holder.iconBg.setBackgroundResource(R.drawable.bg_service_icon)
        holder.ivIcon.setImageResource(iconRes)
        holder.ivIcon.setColorFilter(holder.itemView.context.getColor(color))
        holder.ivIcon.visibility = View.VISIBLE

        holder.itemView.setOnClickListener {
            // Navigate to transaction detail
        }
    }

    override fun getItemCount() = transactions.size

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val iconBg: View = view.findViewById(R.id.iconBg)
        val ivIcon: ImageView = view.findViewById(R.id.ivIcon)
        val tvTitle: TextView = view.findViewById(R.id.tvTitle)
        val tvAmount: TextView = view.findViewById(R.id.tvAmount)
        val tvDate: TextView = view.findViewById(R.id.tvDate)
    }
}
