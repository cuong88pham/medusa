"use client"

import {
  NotificationContextType,
  NotificationItemType,
  useNotifications,
} from "@/providers"
import React, { useEffect, useRef } from "react"
import { NotificationItem } from "./Item"
// @ts-expect-error can't install the types package because it doesn't support React v19
import { CSSTransition, TransitionGroup } from "react-transition-group"
import clsx from "clsx"

export const NotificationContainer = () => {
  const { notifications, removeNotification } =
    useNotifications() as NotificationContextType

  const notificationRefs = useRef([])

  useEffect(() => {
    notificationRefs.current = notificationRefs.current.slice(
      0,
      notifications.length
    )
  }, [notifications])

  const handleClose = (notification: NotificationItemType) => {
    notification.onClose?.()
    if (notification.id) {
      removeNotification(notification.id)
    }
  }

  const renderFilteredNotifications = (
    condition: (notificaiton: NotificationItemType) => boolean,
    className?: string
  ) => {
    return (
      <TransitionGroup
        className={clsx(
          "flex fixed z-40 flex-col gap-docs_0.5 right-0",
          "md:w-auto w-full overflow-y-auto",
          "max-h-[50%] md:max-h-[calc(100vh-57px)]",
          "max-[768px]:max-h-[50%]",
          className
        )}
      >
        {notifications.filter(condition).map((notification, index) => (
          <CSSTransition
            key={notification.id}
            timeout={200}
            classNames={{
              enter: "animate-slideInRight animate-fast",
              exit: "animate-slideOutRight animate-fast",
            }}
            nodeRef={notificationRefs.current[index]}
          >
            <NotificationItem
              {...notification}
              onClose={() => handleClose(notification)}
              ref={notificationRefs.current[index]}
              className={clsx(
                notification.className,
                "!relative !top-0 !bottom-0 !right-0"
              )}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    )
  }

  return (
    <>
      {renderFilteredNotifications(
        (notification) => notification.placement === "top",
        "top-0"
      )}
      {renderFilteredNotifications(
        (notification) => notification.placement !== "top",
        "bottom-0"
      )}
    </>
  )
}
