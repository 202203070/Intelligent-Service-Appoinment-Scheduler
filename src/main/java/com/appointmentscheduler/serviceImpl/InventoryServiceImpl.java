package com.appointmentscheduler.serviceImpl;

import com.appointmentscheduler.entity.Inventory;
import com.appointmentscheduler.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryServiceImpl {
    private InventoryRepository inventoryRepository;

    InventoryServiceImpl(InventoryRepository inventoryRepository){
        this.inventoryRepository = inventoryRepository;
    }
    public LocalDateTime inventoryAvailability(List<Integer> serviceIds){
        List<Inventory> inventoryList = inventoryRepository.findPartsForServices(serviceIds);
        int max=0;
        for(Inventory inventory : inventoryList){
            if(inventory.getAvailableParts()==0){
                max=2;
                inventory.setOrderedParts(inventory.getOrderedParts()+1);
            }
            else{
                inventory.setAvailableParts(inventory.getAvailableParts()-1);
            }
        }
        return LocalDateTime.now().plusDays(max);
    }
}
