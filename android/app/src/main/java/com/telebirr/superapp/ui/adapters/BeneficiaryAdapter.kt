package com.telebirr.superapp.ui.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.telebirr.superapp.R
import com.telebirr.superapp.data.Contact

class BeneficiaryAdapter(
    private val contacts: List<Contact>
) : RecyclerView.Adapter<BeneficiaryAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_beneficiary, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val contact = contacts[position]
        holder.tvName.text = contact.name.split(" ").first()
        holder.avatarView.text = contact.name.first().toString()
    }

    override fun getItemCount() = contacts.size

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val avatarView: TextView = view.findViewById(R.id.avatarView)
        val tvName: TextView = view.findViewById(R.id.tvName)
    }
}
