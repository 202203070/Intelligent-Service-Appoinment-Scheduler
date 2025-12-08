package com.appointmentscheduler.serviceImpl;

import com.appointmentscheduler.entity.Bay;
import com.appointmentscheduler.entity.BayScheduler;
import com.appointmentscheduler.entity.Technician;
import com.appointmentscheduler.entity.TechnicianScheduler;
import com.appointmentscheduler.repository.BaySchedulerRepository;
import com.appointmentscheduler.repository.TechnicianSchedulerRepository;
import com.appointmentscheduler.service.BayAndTechnicianService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BayAndTechnicianServiceImpl implements BayAndTechnicianService {
    private TechnicianSchedulerRepository technicianSchedulerRepository;
    private BaySchedulerRepository baySchedulerRepository;

    BayAndTechnicianServiceImpl(TechnicianSchedulerRepository technicianSchedulerRepository,BaySchedulerRepository baySchedulerRepository){
        this.technicianSchedulerRepository=technicianSchedulerRepository;
        this.baySchedulerRepository=baySchedulerRepository;
    }

    // Configuration: 9:00 AM to 6:00 PM = 9 Hours = 18 Slots (30 mins each)
    private static final int TOTAL_SLOTS = 18;
    private static final LocalTime DAY_START = LocalTime.of(9, 0);

    @Override
    public LocalDateTime bayAndTechnicianAvailability(LocalDateTime partsArrivalTime, int serviceDurationMinutes, List<Technician> qualifiedTechs, List<Bay> qualifiedBays){
        // 1. Calculate required slots (e.g., 120 mins = 4 slots)
        int requiredSlots = (int) Math.ceil((double) serviceDurationMinutes / 30);

        // 2. Iterate through Days (Day 0 to 29)
        LocalDate today = LocalDate.now();

        for (int dayOffset = 0; dayOffset < 30; dayOffset++) {
            LocalDate currentDay = today.plusDays(dayOffset);

            // LOGIC: Skip days before parts arrive
            if (currentDay.isBefore(partsArrivalTime.toLocalDate())) {
                continue;
            }

            // LOGIC: Determine absolute earliest start slot for this specific day
            // This is our "Target" to beat.
            int startSlotIndex = 0;
            if (currentDay.isEqual(partsArrivalTime.toLocalDate())) {
                startSlotIndex = calculateSlotIndex(partsArrivalTime.toLocalTime());
                if (startSlotIndex >= TOTAL_SLOTS) continue;
            }
            if (startSlotIndex < 0) startSlotIndex = 0;

            // --- PER-DAY BEST TRACKING ---
            int bestSlotForDay = Integer.MAX_VALUE;
            Technician bestTech = null;
            Bay bestBay = null;
            boolean foundOnThisDay = false;

            // 3. Brute Force pairs
            // We label the outer loop so we can 'break' out of both loops instantly
            outerLoop:
            for (Technician tech : qualifiedTechs) {
                int techMask = getTechnicianBitmask(tech, currentDay);

                for (Bay bay : qualifiedBays) {
                    int bayMask = getBayBitmask(bay, currentDay);

                    // BITWISE OR: Combine constraints
                    int combinedMask = techMask | bayMask;

                    // 4. Find first available gap
                    int validSlot = findConsecutiveZeros(combinedMask, requiredSlots, startSlotIndex);

                    if (validSlot != -1) {
                        // If this valid slot is better than what we found so far today
                        if (validSlot < bestSlotForDay) {
                            bestSlotForDay = validSlot;
                            bestTech = tech;
                            bestBay = bay;
                            foundOnThisDay = true;

                            // --- YOUR OPTIMIZATION ---
                            // If we found a slot that matches the 'startSlotIndex' exactly,
                            // it is the absolute earliest possible time allowed on this day.
                            // We cannot possibly find an earlier one. Stop searching.
                            if (bestSlotForDay == startSlotIndex) {
                                break outerLoop;
                            }
                        }
                    }
                }
            }

            // 5. Final Decision for the Day
            // Since we iterate days in order (Today -> Tomorrow), if we found anything today,
            // it is guaranteed to be earlier than anything tomorrow. We return immediately.
            if (foundOnThisDay) {
//                result.found = true;
//                result.technician = bestTech;
//                result.bay = bestBay;
//                result.startDateTime = mapSlotToDateTime(currentDay, bestSlotForDay);
//                return result;
                return mapSlotToDateTime(currentDay,bestSlotForDay);
            }
        }

        return null;
    }

    private int findConsecutiveZeros(int mask, int k, int startSearchFrom) {
        int targetMask = (1 << k) - 1;
        for (int i = startSearchFrom; i <= (TOTAL_SLOTS - k); i++) {
            if (((mask >> i) & targetMask) == 0) {
                return i;
            }
        }
        return -1;
    }

    private int calculateSlotIndex(LocalTime time) {
        if (time.isBefore(DAY_START)) return 0;
        long minutesDiff = ChronoUnit.MINUTES.between(DAY_START, time);
        return (int) Math.ceil((double) minutesDiff / 30);
    }

    private LocalDateTime mapSlotToDateTime(LocalDate date, int slotIndex) {
        return date.atTime(DAY_START).plusMinutes(slotIndex * 30L);
    }

    public int getBayBitmask(Bay bay, LocalDate date) {
        return baySchedulerRepository.findByBay_BayIdAndDate(bay.getBayId(), date)
                .map(BayScheduler::getBitmask)
                .orElseGet(() -> {
                    BayScheduler newEntry = new BayScheduler();
                    newEntry.setBay(bay);
                    newEntry.setDate(date);
                    newEntry.setBitmask(0);
                    baySchedulerRepository.save(newEntry);
                    return 0;
                });
    }

//    private int getScheduleBitmask(Long resourceId, LocalDate date) {
//        // Mock DB Call
//        return 0;
//    }

    public int getTechnicianBitmask(Technician tech, LocalDate date) {
        return technicianSchedulerRepository.findByTechnician_TechnicianIdAndDate(tech.getTechnicianId(), date)
                .map(TechnicianScheduler::getBitmask)
                .orElseGet(() -> {
                    // No entry — create with bitmask 0
                    TechnicianScheduler newEntry = new TechnicianScheduler();
                    newEntry.setTechnician(tech);
                    newEntry.setDate(date);
                    newEntry.setBitmask(0);
                    technicianSchedulerRepository.save(newEntry);
                    return 0;
                });
    }
}
