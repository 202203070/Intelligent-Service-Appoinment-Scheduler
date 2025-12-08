package com.appointmentscheduler.serviceImpl;

import com.appointmentscheduler.entity.Inventory;
import com.appointmentscheduler.repository.InventoryRepository;
import com.appointmentscheduler.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {
    private InventoryRepository inventoryRepository;

    InventoryServiceImpl(InventoryRepository inventoryRepository){
        this.inventoryRepository = inventoryRepository;
    }
    public LocalDateTime inventoryAvailability(int serviceId){
        List<Inventory> inventoryList = inventoryRepository.findPartsForService(serviceId);
        int max=0;
        for(Inventory inventory : inventoryList){
            if(inventory.getAvailableParts()==0){

                System.out.println("start : "+inventory.getOrderedParts());
                max=2;
                inventory.setOrderedParts(inventory.getOrderedParts()+1);

                System.out.println("end : "+inventory.getOrderedParts());
            }
            else{
                System.out.println("available start : "+inventory.getAvailableParts());
                inventory.setAvailableParts(inventory.getAvailableParts()-1);
                System.out.println("available end : "+inventory.getAvailableParts());
            }

            inventoryRepository.save(inventory);
        }
        return LocalDateTime.now().plusDays(max);
    }
}
